from flask import Flask, request, jsonify, send_from_directory, send_file, make_response, abort
from flask_cors import CORS
from bson import ObjectId
import pymongo
import bcrypt
import os
import logging
import mimetypes
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB setup
try:
    MONGO_URI = ""
    client = pymongo.MongoClient(MONGO_URI)
    db = client['student_notes']
    notes_collection = db['notes']
    user_collection = db['users']
    logging.info("Connected to local MongoDB successfully!")
except Exception as e:
    logging.error(f"Error connecting to MongoDB: {e}")
    notes_collection = None
    user_collection = None

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Max 50MB file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        note_data = {
            "topicName": request.form.get('topicName'),
            "subject": request.form.get('subject'),
            "facultyName": request.form.get('facultyName'),
            "semester": request.form.get('semester'),
            "unitNumber": request.form.get('unitNumber'),
            "notesType": request.form.get('notesType'),
            "file_path": filename
        }
        
        result = notes_collection.insert_one(note_data)
        return jsonify({"message": "File uploaded successfully", "id": str(result.inserted_id)}), 201
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/notes', methods=['GET', 'POST'])
def handle_notes():
    logger.info(f"Received {request.method} request to /api/notes")
    
    if request.method == 'GET':
        if notes_collection is None:
            logger.error("Database connection not available")
            return jsonify({"error": "Database connection failed"}), 500

        try:
            logger.debug("Attempting to fetch notes from database")
            notes = list(notes_collection.find({}))
            for note in notes:
                note["_id"] = str(note["_id"])
                note["pinned"] = note.get("pinned", False)
            logger.info(f"Successfully retrieved {len(notes)} notes")
            return jsonify(notes), 200

        except Exception as e:
            logger.error(f"Error fetching notes: {str(e)}")
            return jsonify({"error": f"Error fetching notes: {str(e)}"}), 500

    elif request.method == 'POST':
        logger.info("Processing POST request for new note")
        
        if 'file' not in request.files:
            logger.warning("No file part in request")
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            logger.warning("No selected file")
            return jsonify({"error": "No selected file"}), 400
        
        if file and allowed_file(file.filename):
            try:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                logger.debug(f"Saving file to: {file_path}")
                file.save(file_path)
                
                note_data = {
                    "name": request.form.get('name'),
                    "division": request.form.get('division'),
                    "topicName": request.form.get('topicName'),
                    "subject": request.form.get('subject'),
                    "facultyName": request.form.get('facultyName'),
                    "semester": request.form.get('semester'),
                    "unitNumber": request.form.get('unitNumber'),
                    "notesType": request.form.get('notesType'),
                    "file_path": filename,
                    "pinned": False
                }
                
                logger.debug(f"Inserting note data: {note_data}")
                result = notes_collection.insert_one(note_data)
                logger.info(f"Successfully inserted note with ID: {result.inserted_id}")
                return jsonify({"message": "Notes uploaded successfully", "id": str(result.inserted_id)}), 201
            
            except Exception as e:
                logger.error(f"Error saving note: {str(e)}")
                return jsonify({"error": f"Error saving note: {str(e)}"}), 500
        
        logger.warning(f"Invalid file type: {file.filename}")
        return jsonify({"error": "File type not allowed"}), 400

@app.after_request
def after_request(response):
    logger.info(f"Sending response with status: {response.status}")
    return response

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        logging.error(f"File not found: {filename}")
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logging.error(f"Error serving file {filename}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/view/<filename>')
def view_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(file_path):
            abort(404)

        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = 'application/octet-stream'

        return send_file(file_path, mimetype=mime_type, as_attachment=False)
    
    except Exception as e:
        logging.error(f"Error viewing file {filename}: {str(e)}")
        abort(500)

@app.route('/api/toggle-pin', methods=['POST'])
def toggle_pin():
    try:
        data = request.json
        note_id = data.get('noteId')
        pinned = data.get('pinned')

        if not note_id:
            logger.error("Note ID is missing in the request")
            return jsonify({"error": "Note ID is required"}), 400

        logger.info(f"Attempting to toggle pin state for note {note_id} to {pinned}")

        result = notes_collection.update_one(
            {"_id": ObjectId(note_id)},
            {"$set": {"pinned": pinned}}
        )

        if result.modified_count == 0:
            logger.warning(f"Note not found or pin state not changed for note {note_id}")
            return jsonify({"error": "Note not found or pin state not changed"}), 404

        logger.info(f"Successfully updated pin state for note {note_id}")
        return jsonify({"message": "Pin state updated successfully"}), 200

    except Exception as e:
        logger.error(f"Error toggling pin state: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/signup', methods=['POST'])
def signup():
    if user_collection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.json
        required_fields = ["name", "email", "semester", "division", "password"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        if user_collection.find_one({"email": data['email']}):
            return jsonify({"error": "Email is already registered"}), 400

        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        data['password'] = hashed_password.decode('utf-8')

        result = user_collection.insert_one(data)
        return jsonify({"message": "Signup successful", "user_id": str(result.inserted_id)}), 200

    except Exception as e:
        logging.error(f"Error in signup: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    if user_collection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.json
        if 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password are required"}), 400

        user = user_collection.find_one({"email": data['email']})
        if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')): 
            return jsonify({"error": "Invalid credentials"}), 400

        return jsonify({"message": "Login successful", "user_id": str(user['_id'])}), 200

    except Exception as e:
        logging.error(f"Error in login: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    if user_collection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        users = list(user_collection.find({}, {"_id": 1, "name": 1, "email": 1, "semester": 1, "division": 1}))
        for user in users:
            user["_id"] = str(user["_id"])
        return jsonify(users), 200

    except Exception as e:
        logging.error(f"Error getting users: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
