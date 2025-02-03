import { useEffect, useState } from "react"
import axios from "axios"
import "./NotePage.css"

const API_BASE_URL = "http://localhost:5000" // Ensure this matches your backend URL

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    subject: "",
    faculty: "",
  })

  // Faculty mapping for each subject
  const subjectFacultyMapping = {
    "Advance Web Tech": ["Nandini Modi", "Sarah Smith"],
    "AI/ML": ["Tanmay Bhowmik", "Dawindar Paaji"],
    BE: ["Deepak Sahu", "Hardik Vyas", "Ankur Changela"],
    "Big Data": ["Sameer Patel"],
    "C programming": ["John Smith", "Sarah Smith"],
    Chemistry: ["Rama Gaur", "Kalisadan"],
    "Civil Engineering": ["Dhananjay", "Anki Deshmukh", "Habal MC"],
    "Cloud Computing": ["Riddhi Thakkar"],
    "Compiler Design": ["Sameer Patel", "Shivangi Surti"],
    "Computer Networks": ["Santosh Bharti", "Manish Paliwal"],
    Cryptanalysis: ["Rutvij Javeri", "Nishant Doshi"],
    "Cyber Security": ["Ashka Rwal"],
    DAA: ["Aditya Shastri", "Hargeet Kaur"],
    DBMS: ["Nandini Modi", "Jane Doe"],
    DECO: ["Vipul Mishra"],
    DMS: ["Shreekant", "Preetam Pyaare"],
    DSA: ["Nandini Modi", "Aditya Shastri", "Kapil Taklu"],
    "Distributed System": ["Shakti Mishra"],
    "Digital Image Processing": ["Meera Thappar"],
    "Disaster Management": ["Ankit Deshmukh", "Debasis phonechor"],
    EEE: ["Vima Mali"],
    Ethics: ["Kinnari Patel", "Ravi Kant"],
    Java: ["Nandini Modi", "Deboprata Swain", "Nishu"],
    "Mathematics 1": ["Shrikant"],
    "Mathematics-2": ["Shrikant"],
    "Mechanical Engineering": ["Abhanaya GOAT", "Ojas"],
    Microprocessor: ["Kiran Dada", "Tanmay Bhowmik"],
    Physics: ["Abhishek Gor", "Prahlad Bumrah"],
    Python: ["Tanmay Bhowmik", "Rajendra Choudri", "Pooja Shah"],
    "Software Engineering": ["Komal Sharma", "Krishna Brahmabhatt"],
    SPM: ["Ashka Raval"],
    "Web Tech": ["Komal Sharma", "Debopratap Swain"],
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`)
      setNotes(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching notes:", error)
      setError("Failed to fetch notes. Please check your connection and try again.")
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const togglePinNote = async (id) => {
    try {
      const noteToUpdate = notes.find((note) => note._id === id)
      const newPinnedState = !noteToUpdate.pinned

      await axios.post(`${API_BASE_URL}/api/toggle-pin`, {
        noteId: id,
        pinned: newPinnedState,
      })

      setNotes((prevNotes) => prevNotes.map((note) => (note._id === id ? { ...note, pinned: newPinnedState } : note)))
    } catch (error) {
      console.error("Error toggling pin state:", error)
      alert("Failed to update pin state. Please check your connection and try again.")
    }
  }

  const filteredNotes = notes
    .filter((note) => {
      const { subject, faculty } = selectedFilters
      const matchesSubject = !subject || note.subject === subject
      const matchesFaculty = !faculty || note.facultyName.includes(faculty)
      return matchesSubject && matchesFaculty
    })
    .sort((a, b) => {
      if (a.pinned === b.pinned) {
        return 0
      }
      return a.pinned ? -1 : 1
    })

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/uploads/${fileName}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
      alert("Failed to download file. Please check your connection and try again.")
    }
  }

  const handleViewNote = (fileName) => {
    const fileUrl = `${API_BASE_URL}/view/${fileName}`
    window.open(fileUrl, "_blank")
  }

  return (
    <div className="notes-container">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="notes-list">
          <h2 className="page-title">Notes</h2>
          <div className="filters-container">
            <label>
              Subject:
              <select name="subject" value={selectedFilters.subject} onChange={handleFilterChange}>
                <option value="">All</option>
                {Object.keys(subjectFacultyMapping).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Faculty:
              <select name="faculty" value={selectedFilters.faculty} onChange={handleFilterChange}>
                <option value="">All</option>
                {[...new Set(Object.values(subjectFacultyMapping).flat())].map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="cards-container">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note._id} className={`note-card ${note.pinned ? "pinned" : ""}`}>
                  <h3 className="note-title">
                    {note.topicName}
                    <button className="pin-button" onClick={() => togglePinNote(note._id)}>
                      {note.pinned ? "📌 Unpin" : "📌 Pin"}
                    </button>
                  </h3>
                  <p className="semester">
                    <strong>Semester:</strong> {note.semester}
                  </p>
                  <p className="note-subject">
                    <strong>Subject:</strong> {note.subject}
                  </p>
                  <p className="note-faculty">
                    <strong>Faculty:</strong> {note.facultyName}
                  </p>
                  <p className="note-unit">
                    <strong>Unit:</strong> {note.unitNumber}
                  </p>
                  <p className="note-type">
                    <strong>Notes Type:</strong> {note.notesType}
                  </p>
                  <div className="note-actions">
                    {/* <button className="view-button" onClick={() => handleViewNote(note.file_path)}>
                      👁️ View
                    </button> */}
                    <button className="download-button" onClick={() => handleDownload(note.file_path)}>
                      📥 Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notes">No notes found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesPage

