import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function ViewAllPerformances() {
    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const performances = [
        { id: 1, title: 'Video Performance 1' },
        { id: 2, title: 'Video Performance 2' },
        { id: 3, title: 'This is my video title! Success!' },
        { id: 4, title: 'Video Performance 4' },
        { id: 5, title: 'Video Performance 5' },
    ];
    const listItems = performances.map(performance =>
        //<Button href='/script-id' className='button'>{script.text}</Button>
        <option value={performance.title}>{performance.title}</option>
        // <li key={script.id} onClick={() => handleOptionClick(script)}>{script.text}</li>
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
            setError('Failed to fetch performance')
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

                    {/* Video selection and actions */}
                    <div className="button-container">
                        <Button className="button">Download</Button>
                        <Button href='/view-all-scripts' className="button">Delete</Button>
                        <Button href='/performance-id' className="button">Open</Button>
                    </div>
                    <div>
                        <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                            {listItems}
                        </select>
                    </div>

                    {/* Sorting option selection and action */}
                    <div className="button-container">
                        <Button href='/view-all-performances' className="button">Sort By</Button>
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


