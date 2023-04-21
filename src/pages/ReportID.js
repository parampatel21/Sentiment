import React, { useRef, useState, useEffect, useContext } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/styles.css'
import '../styles/HomePage.css'
import { storage, firestore } from '../firebase'
import Navbar from './components/Navbar'
import { GlobalContext } from './components/GlobalState'

function ReportID() {
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
    const [textAnalysis, setTextAnalysis] = useState('Not yet set')
    const [globalTextAnalysis, setGlobalTextAnalysis] = useContext(GlobalContext)[2];

    let str = '';
    str = globalTextAnalysis;
    const new_string = str.replace(/: /g, ":\n")
    console.log(new_string)

    useEffect(() => {
        setTextAnalysis(new_string);
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

        if (!titleRef.current.value || titleRef.current.value < 5) {
            alert("The title should be at least 5 characters long.");
            return;
        }

        const UID = getuser();

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

            firestore.collection(UID).doc(objectId).set({
                title: titleRef.current.value,
                dateUpdated: currentDate,
                script: scriptRef.current.value
            }, { merge: true })
            console.log('Updated firestore!');
            setUploaded(true);
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
        navigate('/scripts')

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
                    <h1>Here's your Report</h1>
                    <p>Welcome to your report page! Here, you can view, edit, and manage your report.</p>
                </section>

                <div>

                    <h2>Title: {data.title}</h2>
                    <br/>
                    <h4>Script: {data.script}</h4>
                    <br/>
                    <h4 style={{ whiteSpace: 'pre-wrap' }}>Report: {new_string}</h4>


                </div>
            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ReportID;