import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VideoRecorder from './VideoRecorder'
import '../styles/styles.css'
import '../styles/HomePage.css'

function TestingGrounds() {
    // references for user's fields
    const scriptRef = useRef()
    // import functions implemented in AuthContext.js
    const { getuser, isAuthenticated, logout } = useAuth()
    // initialize error and loading vars
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [recording, setRecording] = useState(false)
    // initialize navigate obj for redirecting
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

    // Function to handle user interaction with the save button
    async function handleSubmit(e) {
        e.preventDefault()

        // return an error if a condition do not match
        // if (condition to throw an error) {
        //     return setError('Error message here')
        // }

        // try to delete performance id provided and await success then redirect to view of all performances
        try {
            setError('')
            setLoading(true)
            // await saveVideo(videoFile)
            console.log(getuser)
        } catch {
            setError('Failed to save the video')
        }

        setLoading(false)

    }

    function handleFileSelect(event) {
        const fileList = event.target.files;
        // Do something with the file here
        console.log(fileList);
    }

    // const [buttonText, setButtonText] = useState("Start Recording");
    // let button;
    // if (buttonText == 'Start Recording') {
    //     button = <a className='hero-button' onClick={() => setButtonText("Stop Recording")}>{buttonText}</a>
    // } else {
    //     button = <a className='hero-button' onClick={() => setButtonText("Start Recording")}>{buttonText}</a>
    // }


    return (
        <div className="container-fluid">
            {/* Nav bar start */}
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
            {/* Nav bar end */}

            <main>
                <section className="hero">
                    <h1>Welcome to your Recording Session</h1>
                    <p>Here you can record a video performance of your public speaking skills and have your technique analyzed via facial and tonal analysis.</p>
                    <p>Also, feel free to upload or supply a script via the text box below and we'll run our analysis on it to find the tone portrayed through the text.</p>
                    <p>When you're ready, click start recording below to begin your journey to a more confident speech.</p>
                    <VideoRecorder />
                    {/* {button} */}
                </section>

                {/* Handle form submission */}
                <Form onSubmit={handleSubmit}>
                    {/* Form components (Label & Text Box) for Video Title */}
                    <Form.Group id="title">
                        <Form.Label>Type up your script here</Form.Label>
                        <Form.Control style={{ width: '100%', height: '100%' }} type="text" as='textarea' ref={scriptRef} />
                    </Form.Group>
                    <div style={{ marginTop: '5px' }}>
                        <Form.Label>Upload script here:&nbsp;</Form.Label>
                        <input type="file" onChange={handleFileSelect} />
                    </div>
                    {/* Disable the submission button if already pressed and submission is in-progress */}
                    <section className="call-to-action">
                        <a className='hero-button' href='/performance-id'>Save Performance</a>
                    </section>
                </Form>

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default TestingGrounds;
