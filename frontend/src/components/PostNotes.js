import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostNotes.css';

const PostNotes = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    division: '',
    semester: '',
    subject: '',
    facultyName: '',
    unitNumber: '',
    topicName: '',
    notesType: '',
  });

  // Keep your existing mapping objects here (semesterSubjects, facultyMapping, unitTopics)
  // Semester-wise subjects list
  const semesterSubjects = {
    1: ["Mathematics 1", "Physics", "EEE", "Ethics", "Civil Engineering", "C programming"],
    2: ["Mathematics-2", "BE", "Mechanical Engineering", "Chemistry", "EVS"],
    3: ["DMS", "DSA", "Microprocessor", "DECO", "Java"],
    4: ["DAA", "TOC", "OS", "DBMS"],
    5: ["Python", "SPM", "Software Engineering", "Distributed System", "Computer Networks", "Compiler Design", "Disaster Management", "Web Tech", "IS"],
    6: ["Advance Web Tech", "AI/ML", "Cloud Computing", "Cyber Security", "Cryptanalysis", "Digital Image Processing", "Big Data"],
    7: ["Software Deployment", "Semantic Web", "Data Analysis"],
  };

  // Faculty mapping for each subject
  const facultyMapping = {
    "DBMS": ["Dr. Nandini Modi", "Prof. Jane Doe"],
    "Advance Web Tech": ["Dr. Nandini Modi", "Prof. Sarah Smith"],
    "Mathematics 1": ["Dr. Shrikant"],
    "Physics": ["Dr. Abhishek Gor", "Dr. Prahlad Bumrah"],
    "EEE": ["Dr. Vima Mali"],
    "C programming": ["Dr. John Smith", "Dr. Sarah Smith"],
    "Ethics": ["Dr.Kinnari Patel ", "Dr.Ravi Kant"],
    "Civil Engineering": ["Dr. Dhananjay ", " Dr. Anki Deshmukh", "Habal"],
    "Mechanical Engineering": ["Dr. Abhanaya GOAT", "Dr.Ojas"],
    "Mathematics-2":["Dr.Shrikant"],
    "BE": ["Dr. Deepak Sahu","Dr. Hardik Vyas ", "Dr. Ankur Changela"],
    "Chemistry": ["Dr. Rama Gaur", "Dr. Kalisadan"],
    "DMS": ["Dr.Shreekant", "Dr.Preetam Pyaare"],
    "DSA": ["Dr. Nandini Modi", "Dr. Aditya Shastri", "Dr. Kapil Taklu"],
    "Microprocessor": ["Dr.Kiran", "Dr.Tanmay Bhowmik"],
    "DECO": ["Dr. Vipul Mishra"],
    "Java": ["Dr. Nandini Modi", "Dr. Debobrata Swain", "Dr.Nisha"],
    "Python": ["Dr. Tanmay Bhowmik", "Dr. Rajendra Choudri", "Dr Pooja Shah"],
    "SPM": ["Dr. Ashka Raval"],
    "Software Engineering": ["Dr. Komal Sharma", "Dr Krishna Brahmabhatt"],
    "Distributed System": ["Dr. Shakti Mishra"],
    "Computer Networks": ["Dr. Santosh Bharti","Dr. Manish Paliwal"],
    "Compiler Design": ["Dr. Sameer Patel", "Dr. Shivangi Surti"],
    "Disaster Management": ["Dr. Ankit Deshmukh","Dr.Debasis"],
    "Web Tech": ["Dr. Komal Sharma" , "Dr. Debobrata Swain"],
    "AI/ML": ["Dr. Tanmay Bhowmik", "Dr.Dawindar Paaji"],
    "Cloud Computing": ["Dr.Riddhi Thakkar"],
    "Cyber Security": ["Dr.Ashka Rwal"],
    "Cryptanalysis": ["Dr.Rutvij Javeri","Dr. Nishant Doshi"],
    "Digital Image Processing": ["Dr.Meera Thappar"],
    "Big Data": ["Dr. Sameer Patel"],
    "DAA": ["Dr.Aditya Shastri","Dr. Hargeet Kaur"]
  };

  // Topics mapping for each unit of each subject
const unitTopics = {
  "Mathematics 1": {
    1: ["Limits and Continuity", "Differentiation", "Integration", "Applications of Derivatives"],
    2: ["Differential Equations", "Sequences and Series", "Partial Fractions"],
    3: ["Vector Calculus", "Multiple Integrals"],
    4: ["Laplace Transform", "Fourier Series"]
  },
  "Physics": {
    1: ["Mechanics", "Thermodynamics", "Properties of Matter"],
    2: ["Electromagnetism", "Optics", "Modern Physics"],
    3: ["Quantum Mechanics", "Solid State Physics"],
    4: ["Nuclear Physics", "Lasers and Optics"]
  },
  "EEE": {
    1: ["Basic Electrical Engineering", "Kirchhoff's Laws", "AC and DC Circuits"],
    2: ["Electromagnetic Field Theory", "Electric Machines"],
    3: ["Transformers", "Power Systems", "Control Systems"],
    4: ["Digital Electronics", "Microcontrollers"]
  },
  "C programming": {
    1: ["Introduction to C", "Data Types", "Control Structures"],
    2: ["Functions", "Arrays", "Pointers"],
    3: ["Structures", "File Handling"],
    4: ["Dynamic Memory Allocation", "Data Structures in C"]
  },
  "Ethics": {
    1: ["Introduction to Ethics", "Moral Theories", "Ethical Dilemmas"],
    2: ["Applied Ethics", "Corporate Social Responsibility"],
    3: ["Environmental Ethics", "Professional Ethics"],
    4: ["Ethical Decision Making", "Ethical Leadership"]
  },
  "Civil Engineering": {
    1: ["Engineering Materials", "Strength of Materials"],
    2: ["Fluid Mechanics", "Surveying"],
    3: ["Soil Mechanics", "Concrete Technology"],
    4: ["Transportation Engineering", "Structural Analysis"]
  },
  "Mechanical Engineering": {
    1: ["Engineering Mechanics", "Strength of Materials", "Fluid Mechanics"],
    2: ["Thermodynamics", "Machine Design"],
    3: ["Manufacturing Processes", "Heat Transfer"],
    4: ["Mechanical Vibrations", "Refrigeration and Air Conditioning"]
  },
  "Mathematics-2": {
    1: ["Partial Differentiation", "Multiple Integrals"],
    2: ["Vector Calculus", "Laplace Transforms"],
    3: ["Fourier Series", "Differential Equations"],
    4: ["Complex Analysis", "Group Theory"]
  },
  "BE": {
    1: ["Basic Electronics", "Digital Logic Design", "Circuit Theory"],
    2: ["Microprocessor", "Control Systems"],
    3: ["Power Electronics", "Analog Electronics"],
    4: ["Electrical Machines", "Electrical Measurements"]
  },
  "Chemistry": {
    1: ["Atomic Structure", "Chemical Bonding", "Stoichiometry"],
    2: ["Thermodynamics", "Chemical Kinetics"],
    3: ["Polymers", "Electrochemistry"],
    4: ["Surface Chemistry", "Nanotechnology"]
  },
  "DMS": {
    1: ["Data Types", "Arrays", "Strings"],
    2: ["Sorting Algorithms", "Searching Algorithms"],
    3: ["Linked Lists", "Stacks and Queues"],
    4: ["Trees", "Graphs"]
  },
  "DSA": {
    1: ["Introduction to Data Structures", "Arrays", "Linked Lists"],
    2: ["Stacks", "Queues", "Hashing"],
    3: ["Trees", "Graphs", "Sorting Algorithms"],
    4: ["Dynamic Programming", "Greedy Algorithms"]
  },
  "Microprocessor": {
    1: ["Architecture of 8085", "Programming in Assembly Language"],
    2: ["Interrupts", "Memory Interfacing"],
    3: ["I/O Interfacing", "Timer and Counter"],
    4: ["Advanced Microprocessors", "Applications of Microprocessor"]
  },
  "DECO": {
    1: ["Introduction to Data Communication", "Transmission Media"],
    2: ["Analog and Digital Communication"],
    3: ["Error Detection and Correction", "Multiplexing"],
    4: ["Modulation Techniques", "Data Compression"]
  },
  "Java": {
    1: ["Introduction to Java", "OOP Concepts", "Control Structures"],
    2: ["Classes and Objects", "Inheritance", "Polymorphism"],
    3: ["Exception Handling", "File I/O", "Multithreading"],
    4: ["GUI Programming", "Networking in Java"]
  },
  "Python": {
    1: ["Introduction to Python", "Data Types", "Control Flow"],
    2: ["Functions", "Modules", "File Handling"],
    3: ["Object-Oriented Programming", "Exceptions"],
    4: ["GUI Programming with Tkinter", "Web Development with Flask"]
  },
  "SPM": {
    1: ["Software Process Models", "Software Development Life Cycle"],
    2: ["Requirements Engineering", "Design Techniques"],
    3: ["Testing Techniques", "Software Project Management"],
    4: ["Agile Methodologies", "Software Configuration Management"]
  },
  "Software Engineering": {
    1: ["Software Development Models", "Requirements Analysis"],
    2: ["Software Design", "Implementation and Testing"],
    3: ["Software Maintenance", "Project Management"],
    4: ["Software Metrics", "Quality Assurance"]
  },
  "Distributed System": {
    1: ["Introduction to Distributed Systems", "Communication Models"],
    2: ["Synchronization", "Distributed File Systems"],
    3: ["Distributed Databases", "Distributed Algorithms"],
    4: ["Fault Tolerance", "Security in Distributed Systems"]
  },
  "Computer Networks": {
    1: ["Introduction to Networking", "OSI Model", "TCP/IP"],
    2: ["Network Devices", "Routing and Switching"],
    3: ["Application Layer", "Network Security"],
    4: ["Wireless Networks", "Advanced Networking Protocols"]
  },
  "Compiler Design": {
    1: ["Introduction to Compilers", "Lexical Analysis"],
    2: ["Syntax Analysis", "Semantic Analysis"],
    3: ["Code Optimization", "Code Generation"],
    4: ["Code Debugging", "Intermediate Representations"]
  },
  "Disaster Management": {
    1: ["Introduction to Disaster Management", "Types of Disasters"],
    2: ["Disaster Risk Reduction", "Crisis Communication"],
    3: ["Emergency Response", "Preparedness and Recovery"],
    4: ["International Disaster Management", "Environmental Impact"]
  },
  "Web Tech": {
    1: ["Introduction to Web Technologies", "HTML", "CSS"],
    2: ["JavaScript", "DOM Manipulation"],
    3: ["Backend Technologies", "Databases", "APIs"],
    4: ["Responsive Web Design", "Web Security"]
  },
  "AI/ML": {
    1: ["Introduction to AI", "Search Algorithms", "Heuristic Search"],
    2: ["Machine Learning Concepts", "Supervised Learning"],
    3: ["Unsupervised Learning", "Reinforcement Learning"],
    4: ["Neural Networks", "Natural Language Processing"]
  },
  "Cloud Computing": {
    1: ["Introduction to Cloud Computing", "Cloud Architecture"],
    2: ["Virtualization", "Cloud Storage"],
    3: ["Cloud Security", "Cloud Services"],
    4: ["Big Data in Cloud", "Cloud Deployment Models"]
  },
  "Cyber Security": {
    1: ["Introduction to Cyber Security", "Network Security"],
    2: ["Cryptography", "Firewalls and VPNs"],
    3: ["Ethical Hacking", "Penetration Testing"],
    4: ["Cyber Security Laws", "Incident Response"]
  },
  "Cryptanalysis": {
    1: ["Introduction to Cryptography", "Classical Cryptosystems"],
    2: ["Block Ciphers", "Public Key Cryptography"],
    3: ["Hash Functions", "Digital Signatures"],
    4: ["Cryptanalysis Techniques", "Cryptography in Network Security"]
  },
  "Digital Image Processing": {
    1: ["Introduction to Image Processing", "Image Transformations"],
    2: ["Filtering Techniques", "Edge Detection"],
    3: ["Segmentation", "Morphological Operations"],
    4: ["Image Compression", "Image Recognition"]
  },
  "Big Data": {
    1: ["Introduction to Big Data", "Data Storage Systems"],
    2: ["Data Analytics", "Hadoop Framework"],
    3: ["MapReduce", "Data Mining Techniques"],
    4: ["NoSQL Databases", "Big Data Security"]
  },
  "DAA": {
    1: ["Design and Analysis of Algorithms", "Recursion"],
    2: ["Divide and Conquer", "Dynamic Programming"],
    3: ["Greedy Algorithms", "Backtracking"],
    4: ["NP Problems", "Approximation Algorithms"]
  },
  "DBMS": {
    1: ["Introduction", "Constraints"],
    2: ["SQL Commands", "SQL Theory"],
    3: ["Serialization"],
    4: ["Database Security"]

  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'semester' && {
        subject: '',
        facultyName: '',
        unitNumber: '',
        topicName: '',
      }),
      ...(name === 'subject' && {
        facultyName: '',
        unitNumber: '',
        topicName: '',
      }),
      ...(name === 'unitNumber' && { topicName: '' }),
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    if (file) {
      formDataToSubmit.append('file', file);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/notes', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Notes submitted successfully:', response.data);
      navigate('/notes');
    } catch (error) {
      let errorMessage = 'Error submitting notes. ';
      
      if (error.response) {
        errorMessage += error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response received from server. Please check if the server is running.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      console.error('Error details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-notes-container">
      <div className="form-wrapper">
        <h2>Share Your Notes</h2>
        <p>Help your fellow students by sharing your academic materials</p>
        
        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            marginBottom: '1rem', 
            padding: '0.5rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
            >
              <option value="">Select Division</option>
              {[1, 2, 3, 4, 5, 6].map((div) => (
                <option key={div} value={div}>Division {div}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              {Object.keys(semesterSubjects).map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={!formData.semester}
              required
            >
              <option value="">Select Subject</option>
              {semesterSubjects[formData.semester]?.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Faculty Name</label>
            <select
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              disabled={!formData.subject}
              required
            >
              <option value="">Select Faculty</option>
              {facultyMapping[formData.subject]?.map((faculty) => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Unit Number</label>
            <select
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleChange}
              disabled={!formData.subject}
              required
            >
              <option value="">Select Unit</option>
              {Object.keys(unitTopics[formData.subject] || {}).map((unit) => (
                <option key={unit} value={unit}>Unit {unit}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Topic</label>
            <select
              name="topicName"
              value={formData.topicName}
              onChange={handleChange}
              disabled={!formData.unitNumber}
              required
            >
              <option value="">Select Topic</option>
              {unitTopics[formData.subject]?.[formData.unitNumber]?.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notes Type</label>
            <select
              name="notesType"
              value={formData.notesType}
              onChange={handleChange}
              required
            >
              <option value="">Select Notes Type</option>
              <option value="handwritten">Handwritten</option>
              <option value="ppt">PPT</option>
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
              <option value="video">Video Lecture</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Notes</label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Notes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostNotes;