import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'
import { auto } from '@popperjs/core';


function Login() {
    const { logout, isAuthenticated } = useAuth()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, googleSignIn, facebookSignIn } = useAuth()
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
            await googleSignIn()
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
            await facebookSignIn()
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
                    <h1>Sentiment</h1>
                    <p style={{ marginBottom: '4px' }}>Try our application today and discover the power of emotion and tone analysis.</p>
                    <p style={{ fontSize: '40px', marginBottom: '20px' }}>Login</p>
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
                        <div className='w-100 text-center mt-3'>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                        <button style={{ width: '50%' }} className='hero-button' onClick={handleSubmit}>Login with Email</button><br />
                        <button style={{ width: '50%', backgroundColor: '#f4c20d' }} className='hero-button' onClick={handleGoogle}>Login with Google</button><br />
                        <button style={{ width: '50%', backgroundColor: '#3b5998' }} className='hero-button' onClick={handleFacebook}>Login with Facebook</button>
                        {/* <Button disabled={loading} className='w-100' type='submit'>Login</Button> */}
                    </Form>
                    {/* Link to login page if the user already has an account */}
                    <div className='w-100 text-center mt-2'>
                        Don't have an account? <Link to="/signup">Sign up</Link> today.
                    </div>
                </section>
            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}


export default Login;
