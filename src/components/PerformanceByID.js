import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PerformanceByID() {
    // references for user's fields on the ui components
    const titleRef = useRef()
    const descriptionRef = useRef()
    // import function implemented in AuthContext.js
    const { deleteVideo, updateVideo } = useAuth()
    const { getuser } = useAuth()
    // initialize error and loading vars
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const videoID = ''
    // initialize navigate obj for redirecting
    const navigate = useNavigate()

    // Function to handle user interaction with the submit button
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
            await updateVideo(videoID)
            console.log(getuser)
            navigate("/view-all-performances")
        } catch {
            setError('Failed to update video data')
        }

        setLoading(false)

    }

    // Function to handle user interaction with the submit button
    async function handleDelete(e) {
        e.preventDefault()

        // return an error if a condition do not match
        // if (condition to throw an error) {
        //     return setError('Error message here')
        // }

        // try to delete performance id provided and await success then redirect to view of all performances
        try {
            setError('')
            setLoading(true)
            await deleteVideo(videoID)
            console.log(getuser)
            navigate("/view-all-performances")
        } catch {
            setError('Failed to delete the video')
        }
        setLoading(false)

    }
    const currentPath = window.location.pathname;
    const currentDirectory = currentPath.substring(0, currentPath.lastIndexOf('/'));
    const src = `${currentDirectory}/temp.mp4`;
    const [videoSrc, setVideoSrc] = useState(`${currentDirectory}/temp.mp4`);

    // const videoRef = useRef(null);

    // function handlePlay() {
    //     videoRef.current.play();
    // }

    // function handlePause() {
    //     videoRef.current.pause();
    // }

    // return the html to render
    return (
        <>
            {/* Back button to return to the dashboard */}
            <a href="/view-all-performances" class="back-button">Back</a>
            {/* Google react-bootstrap to see how to use the library for easy styled components */}
            <Card>
                <Card.Body>
                    {/* Card header  */}
                    <h2 className='text-center mb-4'>Video Performance</h2>
                    {/* If there is an error caught generate an error message component at the top of this Card */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Handle form submission */}
                    <Form onSubmit={handleSubmit}>
                        {/* Form components (Label & Text Box) for Video Title */}
                        <Form.Group id="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" ref={titleRef} required />
                        </Form.Group>

                        <div>
                            <video src={src} controls type="video/mp4" />
                        </div>
                        {/* <div>
                            <video ref={videoRef}>
                                <source src="./temp.mp4" type="video/mp4" />
                            </video>
                            <div>
                                <Button style={{ width: '48%', marginRight: '3px' }} onClick={handlePlay}>Play</Button>
                                <Button style={{ width: '48%', marginLeft: '3px' }} onClick={handlePause}>Pause</Button>
                            </div>
                        </div> */}
                        {/* Form components (Label & Text Box) for Video Description */}
                        {/* <Form.Group id="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" ref={descriptionRef} style={{ marginBottom: '3px' }} required />
                        </Form.Group> */}
                        <Button href='/script-id' className='button' type='button'>View my script</Button>

                        {/* Disable the submission button if already pressed and submission is in-progress */}
                        <Button disabled={loading} className='button' type='submit'>Save Changes</Button>
                    </Form>
                    <div></div>
                    <Button disabled={loading} className='button' type='submit'>Delete</Button>
                </Card.Body>
            </Card>



        </>
    )
}
