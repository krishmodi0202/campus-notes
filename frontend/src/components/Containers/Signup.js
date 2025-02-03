import React, { useState } from "react";
import { FaUser, FaEnvelope, FaBookReader, FaUsers, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        semester: "",
        division: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.name || !formData.email || !formData.semester || !formData.division || !formData.password) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup Successful!");
                navigate("/");
                setFormData({
                    name: "",
                    email: "",
                    semester: "",
                    division: "",
                    password: ""
                });
            } else {
                setErrorMessage(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErrorMessage(`An unexpected error occurred. Please try again. Error: ${error.message}`);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="card-header">
                    <h1>Create Account</h1>
                    <p>Join our community today!</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Semester</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                            <option value="VI">VI</option>
                            <option value="VII">VII</option>
                        </select>
                    </div>

                    <div className="form-group">
                        
                        <input
                            name="division"
                            placeholder="Division"
                            value={formData.division}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </form>

                

                

                <div className="card-footer">
                    <p>Already have an account? <a href="#">Sign In</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

