import React, { useRef, useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/styles.css'
import '../styles/HomePage.css'
import { storage, firestore } from '../firebase'
import Navbar from './components/Navbar'
import { GlobalContext } from './components/GlobalState'

function ScriptID() {
    const scriptRef = useRef();
    const titleRef = useRef();
    const { getuser } = useAuth();
    const uid = getuser();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [videoBlob, setVideoBlob] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const [title, setTitle] = useState('');
    const objectId = useParams().id;
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const docRef = firestore.collection(uid).doc(objectId.toString());
        docRef.get().then((doc) => {
            const data = doc.data();
            console.log(data);
            setData(data);
        });
    }, [uid, objectId]);


    // Function to handle user interaction with the save button
    async function handleSubmit(e) {
        e.preventDefault()
        const script = scriptRef.current.value;
        if (!script || script.length < 100) {
            alert("The script should be at least 100 characters long.");
            return;
        }

        if (!title || title.length < 5) {
            alert("The title should be at least 5 characters long.");
            return;
        }

        const UID = getuser();
        const new_count = firestore.collection(UID).doc('access_info').get('running_count') + 1
        console.log(new_count)

        const handleUpload = () => {
            const storageRef = storage.ref();
            const fileName = new_count.toString() + `.mp4`;
            const UID = getuser()
            const videoRef = storageRef.child(UID + `/${fileName}`);

            videoRef.put(videoBlob).then((snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);
                setUploaded(true);
            });
        };

        async function handleScriptUpload() {
            const script = scriptRef.current.value.trim();
            const UID = getuser();
            const storageRef = storage.ref();
            const fileName = new_count + `.txt`;
            const scriptRefstorage = storageRef.child(UID + `/${fileName}`);
            await scriptRefstorage.putString(script);
            console.log('Uploaded a blob or file!');
            setUploaded(true);
        }

        async function handleFirestoreUpdate() {
            const title = titleRef.current.value.trim();
            const script = scriptRef.current.value.trim();
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const currentDate = `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`;


            firestore.collection(UID).doc("access_info").set({
                running_count: new_count.toString()
            }, { merge: true })
            firestore.collection(UID).doc(new_count).set({
                title: title,
                timestamp: currentDate,
            })
            console.log('Updated firestore!');
            setUploaded(true);
        }


        try {
            setError('')
            setLoading(true)
            handleUpload()
        } catch {
            setError('Failed to upload the video')
        }

        try {
            setError('')
            setLoading(true)
            handleScriptUpload()
        } catch {
            setError('Failed to upload the script')
        }

        try {
            setError('')
            setLoading(true)
            handleFirestoreUpdate()
        } catch {
            setError('Failed to update the database')
        }

        alert('Upload successful!')
        setLoading(false)

    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const fileType = file.type;

        // Only accept text-based file types
        if (!fileType.startsWith('text/')) {
            alert('Invalid file type. Please select a text-based file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContents = event.target.result;
            console.log(fileContents);
            // Set the text box value to the file contents
            scriptRef.current.value = fileContents;
        };
        reader.readAsText(file);
    }

    return (
        <div className="container-fluid">
            <Navbar />

            <main>
                <section className="hero">
                    <h1>Here's your Script</h1>
                    <p>Welcome to your script editor! Here, you can view, edit, and manage all of your scripts in one place. Whether you're a seasoned writer or just starting out, this editor is designed to make your writing process as smooth and streamlined as possible.</p>
                    <p>We've designed this editor to be as intuitive as possible, but if you have any questions or run into any issues, our support team is always here to help. Just click the "About" button in the navbar above to get in touch.</p>
                    <p>Happy writing!</p>
                </section>

                <Form.Group id="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" ref={titleRef} defaultValue={data.title} required onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                {/* Handle form submission */}
                <Form onSubmit={handleSubmit}>
                    {/* Form components (Label & Text Box) for Video Title */}
                    <Form.Group id="title">
                        <Form.Label>Type up your script here</Form.Label>
                        <Form.Control style={{ width: '100%', height: '100%' }} defaultValue={data.script} type="text" as='textarea' ref={scriptRef} />
                    </Form.Group>
                    <div style={{ marginTop: '5px' }}>
                        <Form.Label>Upload script here:&nbsp;</Form.Label>
                        <input type="file" onChange={handleFileSelect} />
                    </div>
                    {/* Disable the submission button if already pressed and submission is in-progress */}
                    <section className="call-to-action">
                        <a className='hero-button' onClick={handleSubmit} href='/performance-id'>Save Script</a>
                    </section>
                </Form>

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ScriptID;