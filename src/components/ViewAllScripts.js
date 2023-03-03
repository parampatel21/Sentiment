import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/styles.css'

export default function ViewAllScripts() {
    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const scripts = [
        { id: 1, title: 'Script 1' },
        { id: 2, title: 'This is my amazing script title!' },
        { id: 3, title: 'Script 3' },
        { id: 4, title: 'Script 4' },
        { id: 5, title: 'Script 5' },
    ];
    const listItems = scripts.map(script =>
        //<Button href='/script-id' className='button'>{script.text}</Button>
        <option value={script.title}>{script.title}</option>
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

                    {/* Script selection and actions */}
                    <div className="button-container">
                        <Button className="button">Download</Button>
                        <Button href='/view-all-scripts' className="button">Delete</Button>
                        <Button href='/script-id' className="button">Open</Button>
                    </div>
                    <div>
                        <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                            {listItems}
                        </select>
                    </div>

                    {/* Sorting option selection and action */}
                    <div className="button-container">
                        <Button href='/view-all-scripts' className="button">Sort By</Button>
                    </div>
                    <div>
                        <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                            <option value={'byTitle'}>Title</option>
                            <option value={'byDateCreated'}>Date Created</option>
                            <option value={'byDateUpdated'}>Date Updated</option>
                        </select>
                    </div>


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


