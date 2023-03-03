import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/styles.css'
import axios from 'axios';


export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout} = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate('login')
        } catch {
            setError('Failed to log out')
        }
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
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Home</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong>{currentUser.email}
                    {/* <Button onClick={use_axios} className='button' type='button'>Test Google Cloud Function</Button> */}
                    <Button href="/record-performance" className='button' type='button'>Record A Performance</Button>
                    <Button href="/update-profile" className='button' type='button'>Update Profile</Button>
                    <Button href="/view-all-performances" className='button' type='button'>View All Performances</Button>
                    <Button href="/view-all-scripts" className='button' type='button'>View All Scripts</Button>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Button variant='link' onClick={handleLogout}>Log Out</Button>
            </div>
        </>


    )
}
