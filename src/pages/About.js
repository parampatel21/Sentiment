import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VideoRecorder from './components/VideoRecorder'
// import '../styles/styles.css'
import '../styles/HomePage.css'
import Navbar from './components/Navbar'

function About() {
    const { isAuthenticated, logout } = useAuth()
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    function handleClick() {
        fetch('https://us-central1-sentiment-379415.cloudfunctions.net/test_function')
        .then(response => response.text())
        .then(data => {
          console.log(data); // prints "Hello, World!"
        });
    }

    return (
        <div className="container-fluid">
            {/* Nav bar start */}
            <header>
                <Navbar />
            </header>
            {/* Nav bar end */}

            <main>
            <button onClick={handleClick}>Trigger Cloud Function</button>
                <div className="hero">
                    <h1>About Us</h1>
                    <p>We are a company that provides great products and services to our customers. We strive to create innovative solutions that meet the needs of our customers.</p>
                </div>

                <div className="features">
                    <div className="feature">
                        <i className="fas fa-users"></i>
                        <h2>Our Team</h2>
                        <p>We have a dedicated team of professionals who work hard to ensure our customers are satisfied.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-certificate"></i>
                        <h2>Our Mission</h2>
                        <p>Our mission is to provide the best products and services to our customers.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-star"></i>
                        <h2>Our Vision</h2>
                        <p>Our vision is to be the leading company in our industry.</p>
                    </div>
                </div>

                <div className="call-to-action">
                    <h2>Want to learn more about us?</h2>
                    <button>Get in touch</button>
                </div>
            </main>

            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default About;
