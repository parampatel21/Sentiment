import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function ViewAllScripts() {
    const scripts = [
        'Demo Scripts 1... More info....',
        'Demo Scripts 2... More info....',
        'Demo Scripts 3... More info....',
        'Demo Scripts 4... More info....',
        'Demo Scripts 5... More info....',
        'Demo Scripts 6... More info....',
    ];
    const listItems = scripts.map(script =>
        <Button>{script}</Button>
    );
    const { fetchScriptByID } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            // await fetchScriptByID(scriptSelected)
            navigate("/script-id-${sid}")
        } catch {
            setError('Failed to sign in')
        }

        setLoading(false)

    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>View All Scripts</h2>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <ul>{listItems}</ul>

                    {/* <Form onSubmit={handleSubmit}>
                        <Form.Group id="allPerformances">
                            <Form.Label>All Performances</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Button disabled={loading} className='w-100' type='submit'>Login</Button>
                    </Form> */}
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
            </div>



        </>
    )
}


