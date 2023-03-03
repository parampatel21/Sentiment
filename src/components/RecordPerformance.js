import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/styles.css'

export default function RecordPerformance() {
    // references for user's fields on the ui components
    const filePath = ''
    const videoFile = ''
    const scriptRef = useRef()

    // import function implemented in AuthContext.js
    const { recordVideo, uploadScript, saveVideo } = useAuth()
    const { getuser } = useAuth()
    // initialize error and loading vars
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [recording, setRecording] = useState(false)
    // initialize navigate obj for redirecting
    const navigate = useNavigate()

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
        console.log(fileList);
    }

    const [buttonText, setButtonText] = useState("Record");
    let button;
    if (buttonText == 'Record') {
        button = <Button className='button' onClick={() => setButtonText("Stop Recording")}>{buttonText}</Button>
    } else {
        button = <Button className='button' onClick={() => setButtonText("Record")}>{buttonText}</Button>
    }

    // return the html to render
    return (
        <>
            {/* Back button to return to the dashboard */}
            <a href="/" class="back-button">Back</a>

            {/* Google react-bootstrap to see how to use the library for easy styled components */}
            <Card>
                <Card.Body>

                    {/* Card header  */}
                    <h2 className='text-center mb-4'>Record Your Performance</h2>
                    {/* If there is an error caught generate an error message component at the top of this Card */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {/* Handle form submission */}
                    <Form onSubmit={handleSubmit}>
                        {/* Form components (Label & Text Box) for Video Title */}
                        <Form.Group id="title">
                            <Form.Label>Type up your script here</Form.Label>
                            <Form.Control style={{ width: '100%', height: '100%' }} type="text" as='textarea' ref={scriptRef} />
                        </Form.Group>
                        <div style={{ marginTop: '5px' }}>
                            <Form.Label>Upload script here</Form.Label>
                            <input type="file" onChange={handleFileSelect} />
                        </div>
                        {button}
                        {/* Disable the submission button if already pressed and submission is in-progress */}
                        <Button href='/performance-id' disabled={loading} className='button' type='submit'>Save</Button>
                    </Form>

                </Card.Body>
            </Card>



        </>
    )
}
