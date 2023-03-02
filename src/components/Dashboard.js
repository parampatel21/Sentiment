import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getStorage, ref } from 'firebase/storage'

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
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


    // TODO: below does not work

    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);


    const handleUpload = (userID) => {
        setUploading(true);
        const storage = getStorage();
        const storageRef = ref(storage);
        const userRef = storageRef.child(`users/${userID}`);
        const videoRef = userRef.child(videoFile.name);
        videoRef.put(videoFile)
            .then(() => {
                console.log("Upload successful!");
                setUploading(false);
            })
            .catch((error) => {
                console.error(error);
                setUploading(false);
            });
    };

    // end TODO

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Home</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong>{currentUser.email}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
                    <Button
                        // disabled={!videoFile || uploading} 
                        // onClick={handleUpload(currentUser.userID)} 
                        className="btn btn-primary w-100 mt-3">Upload Video</Button>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Button variant='link' onClick={handleLogout}>Log Out</Button>
            </div>
        </>


    )
}
