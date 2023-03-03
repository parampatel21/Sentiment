import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFirestore } from '../contexts/FirestoreContext'
import '../styles/styles.css'

export default function Signup() {
    // references for user's fields on the ui components
    const emailRef = useRef()
    const passwordRef = useRef()
    const nameRef = useRef()
    const passwordConfirmRef = useRef()
    // import function implemented in AuthContext.js
    const { signup, getuser, initDBCollection } = useAuth()
    // const { initDBCollection } = useFirestore();
    // initialize error and loading vars
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    // initialize navigate obj for redirecting
    const navigate = useNavigate()

    // Function to handle user interaction with the submit button
    async function handleSubmit(e) {
        e.preventDefault()

        // return an error if the password and passwordConfirm do not match
        if (passwordRef.current.value !==
            passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        // try to signup credentials provided and await success then redirect to dashboard
        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            const UID = getuser();
            initDBCollection(UID, nameRef.current.value)
            navigate('/')
        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)

    }

    // return the html to render
    return (
        <>
            {/* Google react-bootstrap to see how to use the library for easy styled components */}
            <Card>
                <Card.Body>
                    {/* Card header  */}
                    <h2 className='text-center mb-4'>Sign Up</h2>
                    {/* If there is an error caught generate an error message component at the top of this Card */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {/* Handle form submission */}
                    <Form onSubmit={handleSubmit}>
                        {/* Form components (Label & Text Box) for Name */}
                        <Form.Group id="name">
                            <Form.Label>First and Last Name</Form.Label>
                            <Form.Control type="name" ref={nameRef} required />
                        </Form.Group>
                        {/* Form components (Label & Text Box) for Email */}
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        {/* Form components (Label & Text Box) for Password */}
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        {/* Form components (Label & Text Box) for Password-Confirmation */}
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <div></div>
                        {/* Disable the submission button if already pressed and submission is in-progress */}
                        <Button disabled={loading} className='bttns' type='submit' style={{ marginBottom: '5px' }}>Sign Up</Button>
                        <Button disabled={loading} className='bttns' type='button'>Sign Up with Facebook</Button>
                        <Button disabled={loading} className='bttns' type='button'>Sign Up with Google</Button>
                    </Form>
                </Card.Body>
            </Card>
            {/* Link to login page if the user already has an account */}
            <div className='w-100 text-center mt-2'>
                Already have an account? <Link to="/login">Log In</Link>
            </div>



        </>
    )
}
