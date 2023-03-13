import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'


function TestingGrounds() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const nameRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, getuser, initDBCollection } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        // return an error if the password and passwordConfirm do not match
        if (passwordRef.current.value !==
            passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            const UID = getuser()
            initDBCollection(UID, nameRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to sign in')
        }

        setLoading(false)

    }

    return (
        <div className="container">
            {/* <Navbar /> */}
            <main>
                <section className="hero">
                    <h1>Sentiment</h1>
                    <p style={{ marginBottom: '4px' }}>Try our application today and discover the power of emotion and tone analysis.</p>
                    <p style={{ fontSize: '40px', marginBottom: '4px' }}>Signup</p>
                    {/* <h1>Signup</h1> */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {/* Form components (Label & Text Box) for Name */}
                        <Form.Group id="name">
                            <Form.Label>First and Last Name</Form.Label>
                            <Form.Control type="name" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group id="email" style={{ marginBottom: '3px' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password" style={{ marginBottom: '3px' }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        {/* Form components (Label & Text Box) for Password-Confirmation */}
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <div></div>
                        <button style={{ width: '50%' }} className='hero-button' onClick={handleSubmit}>Sign Up</button>
                        {/* <Button disabled={loading} className='w-100' type='submit'>Login</Button> */}
                    </Form>
                    {/* Link to login page if the user already has an account */}
                    <div className='w-100 text-center mt-2'>
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </section>
            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}


export default TestingGrounds;
