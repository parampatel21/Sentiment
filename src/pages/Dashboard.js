import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar';
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

    return (
        <div className="container">
            <Navbar />
            <main>
                <section className="hero">
                    <h1>Welcome to Sentiment</h1>
                    <p>Our application uses advanced technology to analyze emotions and tone via video and audio recordings. Our cutting-edge algorithms can accurately detect and analyze a wide range of emotions and tones, including happiness, sadness, anger, fear, and more.</p>
                    <p>Whether you're looking to improve your public speaking skills, want to better understand your emotional state, or need to analyze the emotional tone of a conversation, our app can help. Simply record a video or audio clip, and our app will provide you with detailed insights into the emotions and tone present in the recording.</p>
                    <p>Our application is perfect for individuals, businesses, and organizations looking to improve communication and better understand emotions. With our app, you can gain a deeper understanding of yourself and others, leading to more productive conversations and relationships.</p>
                    <p>Try our application today and discover the power of emotion and tone analysis.</p>
                    {isAuthenticated() ? (
                        <Link className='hero-button' to='/record' >Start a Recording</Link>
                    ) : (
                        <Link className='hero-button' to='/signup'>Join Us!</Link>
                    )}

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

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Dashboard;
