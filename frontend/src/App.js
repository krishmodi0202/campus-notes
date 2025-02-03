import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Signup from "./components/Containers/Signup";
import Login from "./components/Containers/Login";
import PostNotes from "./components/PostNotes";  
import NotesPage from './components/Containers/NotesPage';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/post-notes" element={<PostNotes />} />
                <Route path="/notes" element={<NotesPage />} />  {/* Corrected line */}
            </Routes>
        </Router>
    );
};

export default App;
