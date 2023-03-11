import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'


function TestingGrounds() {
    const { logout, isAuthenticated } = useAuth()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to sign in')
        }

        setLoading(false)

    }

    async function handleGoogle(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            // await yourFunctionHere()
            navigate("/")
        } catch {
            setError('Failed to sign in using Google credentials :(')
        }

        setLoading(false)

    }

    async function handleFacebook(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            // await yourFunctionHere()
            navigate("/")
        } catch {
            setError('Failed to sign in')
        }

        setLoading(false)

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
        <div className="container">
            {/* <Navbar /> */}
            <main>
                <section className="hero">
                    <h1>Sentiment: Login</h1>
                    <p>Try our application today and discover the power of emotion and tone analysis.</p>
                </section>
                <section className="call-to-action">
                    <h2>Get Started Today</h2>
                    <h2 className='text-center mb-4'>Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" style={{ marginBottom: '3px' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password" style={{ marginBottom: '3px' }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <button style={{ width: '100%' }} className='hero-button' onClick={handleSubmit}>Login with Email</button>
                        <button style={{ width: '100%', backgroundColor: '#f4c20d' }} className='hero-button' onClick={handleGoogle}>Login with Google</button>
                        <button style={{ width: '100%', backgroundColor: '#3b5998' }} className='hero-button' onClick={handleFacebook}>Login with Facebook</button>
                        {/* <Button disabled={loading} className='w-100' type='submit'>Login</Button> */}
                    </Form>
                    <div className='w-100 text-center mt-3'>
                        <Link to="/forgot-password">Forgot Password?</Link>
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
