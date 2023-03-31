import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './components/Navbar'

export default function Profile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !==
            passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        const promises = []
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            navigate('/')
        }).catch(() => {
            setError('Failed to update account')
        }).finally(() => {
            setLoading(false)
        })

        setLoading(false)
    }

    return (
        <div className="container-fluid">
            <Navbar />

            <main>
                <section className="hero">
                    <h1>Welcome to your Profile page</h1>
                    <p>Here you can update your email and/or password. When you're ready, click save changes.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    </div>

                    {/* {button} */}
                </section>

                {/* Handle form submission */}
                <Form onSubmit={handleSubmit}>
                    {/* Form components (Label & Text Box) for Video Title */}
                    <Form.Group id="email" style={{ marginBottom: '3px' }}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email} required />
                    </Form.Group>
                    <Form.Group id="password" style={{ marginBottom: '3px' }}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm" style={{ marginBottom: '3px' }}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                    {/* Disable the submission button if already pressed and submission is in-progress */}
                    <section className="call-to-action">
                        <a className='hero-button' onClick={handleSubmit} href='/'>Save Changes</a>
                    </section>
                </Form>

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

