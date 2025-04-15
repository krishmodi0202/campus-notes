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
    "Advance Web Tech": ["Dr. Nandini Modi", "Dr. Krish Modi"],
    "AI/ML": ["Dr. Tanmay Bhowmik", "Dr. Dawindar"],
    BE: ["Dr. Deepak Sahu", "Dr. Hardik Vyas", "Dr. Ankur Changela"],
    "Big Data": ["Dr. Sameer Patel"],
    "C programming": ["Dr. Krish Modi", "Dr. Yogesh Arora"],
    Chemistry: ["Dr. Rama Gaur", "Dr. Kalisadan"],
    "Civil Engineering": ["Dr. Dhananjay", "Dr. Ankit Deshmukh", "Dr. Ayana Habal "],
    "Cloud Computing": ["Dr.Riddhi Thakkar","Dr. Rajeev Gupta"],
    "Compiler Design": ["Dr. Sameer Patel", "Dr. Shivangi Surti"],
    "Computer Networks": ["Dr. Santosh Bharti", "Dr. Manish Paliwal"],
    Cryptanalysis: ["Dr.Rutvij Javeri", "Dr. Nishant Doshi"],
    "Cyber Security": ["Dr.Ashka Rawal"],
    DAA: ["Dr. Aditya Shastri", "Dr. Hargeet Kaur"],
    DBMS: ["Dr. Nandini Modi", "Dr. Debarata Swain"],
    DECO: ["Dr. Vipul Mishra"],
    DMS: ["Dr. Shreekant", "Dr. Preetam Gupta"],
    DSA: ["Dr. Nandini Modi", "Dr. Aditya Shastri", "Dr.Kapil Sharma"],
    "Distributed System": ["Dr.Shakti Mishra"],
    "Digital Image Processing": ["Dr.Meera Thappar"],
    "Disaster Management": ["Dr.Ankit Deshmukh", "Dr.Debasis Sarkar"],
    EEE: ["Dr.Vima Mali"],
    Ethics: ["Dr.Kinnari Patel", "Dr.Ravi Kant"],
    Java: ["Dr.Nandini Modi", "Dr.Debobrata Swain", "Dr.Nishu"],
    "Mathematics 1": ["Dr.Shrikant"],
    "Mathematics-2": ["Dr.Shrikant"],
    "Mechanical Engineering": ["Dr.Abhanaya", "Dr.Ojas"],
    Microprocessor: ["Dr.Kiran Parmar", "Dr.Tanmay Bhowmik"],
    Physics: ["Dr.Abhishek Gor", "Dr.Prahlad Bumrah"],
    Python: ["Dr.Tanmay Bhowmik", "Dr.Rajendra Choudawry", "Dr.Pooja Shah"],
    "Software Engineering": ["Dr.Komal Singh", "Dr.Krishna Brahmabhatt"],
    SPM: ["Dr.Ashka Raval"],
    "Web Tech": ["Dr.Komal Singh", "Dr.Debabarata Swain"],
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

