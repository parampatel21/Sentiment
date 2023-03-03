import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function ViewAllPerformances() {
    const performances = [
        'Demo Performance 1... More info....',
        'Demo Performance 2... More info....',
        'Demo Performance 3... More info....',
        'Demo Performance 4... More info....',
        'Demo Performance 5... More info....',
        'Demo Performance 6... More info....',
    ];
    const listItems = performances.map(performance =>
        <Button href='/performance-id'>{performance}</Button>
    );
    const { fetchPerformanceByID } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // GETTING DATA CODE HERE, NONE OF IT IS WORKING YET JUST SKELETON:

    // const { getuser } = useAuth()
    // const count = 0;
    // db.collection(getuser()).get().then(function(querySnapshot) {
    //     count = querySnapshot.size;
    // });

    // if (count < 2) {
    //     console.log("DB issue, check schema")
    // }
    // if (count == 2) {
    //     console.log("no videos so far!")
    // }
    // if (count > 2) {
    //     console.log("multiple videos, work on enumeration")
    // }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            // await fetchPerfomanceByID(performanceSelected)
            navigate("/performance-id-${pid}")
        } catch {
            setError('Failed to sign in')
        }

        setLoading(false)

    }

    return (
        <>
            {/* Back button to return to the dashboard */}
            <a href="/" class="back-button">Back</a>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>View All Performances</h2>
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


