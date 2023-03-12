import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, googleSignIn } = useAuth()
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

    async function handleGoogleLogIn(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await googleSignIn()
            navigate("/")
        } catch { 
            setError('Failed to sign in')
        }

        setLoading(false)
    }



    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <br></br>
                        <Button disabled={loading} className='w-100' type='submit'>Login</Button>
                    </Form>
                    <br></br>
                    <Button onClick={handleGoogleLogIn} className='w-100' type='submit'>Login with Google</Button>
                    <div className='w-100 text-center mt-3'>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                Need an Account? <Link to="/signup">Sign Up</Link>
            </div>



        </>
    )
}
