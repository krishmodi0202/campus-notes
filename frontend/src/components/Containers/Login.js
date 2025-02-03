import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // To store error message
    const navigate = useNavigate(); // For redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear any existing error message before sending request

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Login failed");
            } else {
                alert("Login Successful!");
                navigate("/"); // Redirect to homepage on success
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    const handleInputChange = (e) => {
        // Clear error message when user starts typing again
        setErrorMessage("");
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="card-header">
                    <h1>Login</h1>
                    <p>Welcome back! Please log in to continue.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error */}

                    <button type="submit" className="login-button">Login</button>
                </form>

                <div className="card-footer">
                    <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
