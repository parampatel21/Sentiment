import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function ViewAllScripts() {
    const [selectedOption, setSelectedOption] = useState(null);
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    const scripts = [
        { id: 1, text: 'Script 1' },
        { id: 2, text: 'Script 2' },
        { id: 3, text: 'Script 3' },
        { id: 4, text: 'Script 4' },
        { id: 5, text: 'Script 5' },
    ];
    const listItems = scripts.map(script =>
        <Button href='/script-id' className='button'>{script.text}</Button>

        // <li key={script.id} onClick={() => handleOptionClick(script)}>{script.text}</li>
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
            setError('Failed to fetch the script')
        }

        setLoading(false)

    }

    return (
        <>
            {/* Back button to return to the dashboard */}
            <a href="/" class="back-button">Back</a>
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


