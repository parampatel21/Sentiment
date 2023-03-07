import React, { useState, useEffect } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
// import '../styles/styles.css'
import '../styles/HomePage.css'


function Dashboard() {

    const [error, setError] = useState("")
    const { logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            // navigate('/login')
            window.location.reload();
        } catch {
            setError('Failed to log out')
        }
    }

    async function use_axios() {
        axios({
            method: 'post',
            url: 'https://us-central1-sentiment-379415.cloudfunctions.net/test_function',
            data: {
                message: 'Hello'
            }
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container-fluid">
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/view-all-performances">View Performances</a></li>
                        <li><a href="/view-all-scripts">View Scripts</a></li>
                        <li><a href="/update-profile">Manage Account</a></li>
                        {isAuthenticated ? (
                            <li><a href="" onClick={handleLogout}>Logout</a></li>
                        ) : (
                            <li><a href="/login">Login</a></li>
                        )}
                        {/* <li><a href="" onClick={use_axios}>Test Google Cloud Function</a></li> */}

                    </ul>
                </nav>
            </header>
            <main>
                <section className="hero">
                    <h1>Welcome to Sentiment</h1>
                    <p>Our application uses advanced technology to analyze emotions and tone via video and audio recordings. Our cutting-edge algorithms can accurately detect and analyze a wide range of emotions and tones, including happiness, sadness, anger, fear, and more.</p>
                    <p>Whether you're looking to improve your public speaking skills, want to better understand your emotional state, or need to analyze the emotional tone of a conversation, our app can help. Simply record a video or audio clip, and our app will provide you with detailed insights into the emotions and tone present in the recording.</p>
                    <p>Our application is perfect for individuals, businesses, and organizations looking to improve communication and better understand emotions. With our app, you can gain a deeper understanding of yourself and others, leading to more productive conversations and relationships.</p>
                    <p>Try our application today and discover the power of emotion and tone analysis.</p>
                    <a className='hero-button' href="/record-performance">Try Today</a>
                </section>
                <section className="features">
                    <div className="feature">
                        <i className="fas fa-globe"></i>
                        <h2>Global Reach</h2>
                        <p>We're hosted on the world wide web. Tell your mom about us.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-clock"></i>
                        <h2>24/7 Support</h2>
                        <p>Just ask. I'll give you my phone number.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-lock"></i>
                        <h2>Secure Transactions</h2>
                        <p>Don't worry about your credit card information being stolen. We only take cash.</p>
                    </div>
                </section>
                <section className="call-to-action">
                    <h2>Get Started Today</h2>
                    {isAuthenticated ? (
                            <a className='hero-button' href='/record-performance'>Start a Performance</a>
                        ) : (
                            <a className='hero-button' href='/signup'>Sign Up</a>
                        )}
                    
                </section>
            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Dashboard;
