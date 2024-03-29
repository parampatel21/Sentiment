import React, { useRef, useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VideoRecorder from './components/VideoRecorder'
import { GlobalContext } from './components/GlobalState'
import '../styles/styles.css'
import '../styles/HomePage.css'
import { storage, firestore } from '../firebase'
import Navbar from './components/Navbar'

function VideoID() {
    const [globalPerformance, setGlobalPerformance] = useContext(GlobalContext)[0];
    const [globalTextAnalysis, setGlobalTextAnalysis] = useContext(GlobalContext)[2];
    const [globalVideoAnalysis, setGlobalVideoAnalysis] = useContext(GlobalContext)[3];
    const [performance, setPerformance] = useState(globalPerformance);
    const objectId = useParams().id;
    const scriptRef = useRef();
    const titleRef = useRef();
    const [textAnalysis, setTextAnalysis] = useState('Not yet set')
    const { getuser, isAuthenticated } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const videoRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const [title, setTitle] = useState('');
    const uid = getuser();

    const [data, setData] = useState([]);

    let str = '';
    str = globalTextAnalysis;
    const new_string = str.replace(/: /g, ":\n")
    console.log(new_string)

    let str2 = '';
    str = globalVideoAnalysis;
    const new_string2 = str.replace(/: /g, ":\n")
    console.log(new_string2)
    // let new_string = ""

    useEffect(() => {
        setTextAnalysis(new_string);
        const docRef = firestore.collection(uid).doc(objectId.toString());
        docRef.get().then((doc) => {
            const data = doc.data();
            console.log(data);
            setData(data);
        });
    }, [uid, objectId]);

    console.log(globalPerformance)

    const loadVideo = () => {
        // console.log(objectId)
        // console.log(performance)
        const title = performance.title;
        const collectionRef = firestore.collection(uid);
        collectionRef.where("title", "==", title)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id);
                    const storageRef = storage.ref();
                    const fileRef = storageRef.child(uid + '_' + doc.id + '.avi');
                    fileRef.getDownloadURL().then(function (url) {
                        setVideoSrc(url);

                    }).catch(function (error) {
                        // handle errors
                        console.log(error);
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    };

    const handlePlayback = () => {
        setPlaying(true);
        videoRef.current.play();
    };

    const handlePause = () => {
        setPlaying(false);
        videoRef.current.pause();
    };

    const handleScrub = (event) => {
        setCurrentTime(event.target.value);
        videoRef.current.currentTime = event.target.value;
    };

    const handleReset = () => {
        setVideoBlob(null);
        setVideoSrc(null);
        setCurrentTime(0);
        setUploaded(false);
    };

    // Function to handle user interaction with the save button
    async function handleSubmit(e) {
        e.preventDefault()
        const script = scriptRef.current.value;
        if (!script || script.length < 100) {
            alert("The script should be at least 100 characters long.");
            return;
        }

        if (!videoSrc) {
            alert("No video has been fetched.");
            return;
        }

        if (!titleRef.current.value || titleRef.current.length < 5) {
            alert("The title should be at least 5 characters long.");
            return;
        }

        const UID = getuser();

        async function handleFirestoreUpdate() {
            const title = titleRef.current.value;
            const script = scriptRef.current.value;
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const currentDate = `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`;

            firestore.collection(UID).doc(objectId).set({
                title: title,
                script: script,
                dateUpdated: currentDate,
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

        // console.log(titleRef.current.value)
        // console.log(scriptRef.current.value)

        alert('Upload successful!')
        setLoading(false)

        navigate('/videos')

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

    // function testServerText() {
    //     fetch('https://134.209.213.235:443', {
    //         method: 'POST',
    //         body: `{"uid": ${uid}, "index": ${objectId}}`
    //     })
    //         .then(response => response.text())
    //         .then(data => {
    //             console.log(data)
    //             setTextAnalysis(data)
    //         })
    //         .catch(error => console.error(error))

    // } // PORT IS DIFFERENT IT SAYS 443

    // testServerText()

    loadVideo();
    console.log(globalTextAnalysis)

    return (
        <div className="container-fluid">
            <Navbar />

            <main>
                <section className="hero">
                    <h1>Welcome to your Video Performance</h1>
                    <p>Here you can view and modify a video performance of your public speaking skills and have your technique analyzed via facial and tonal analysis.</p>
                    <p>Also, feel free to upload or supply a script via the text box below and we'll run our analysis on it to find the tone portrayed through the text.</p>
                    <p>When you're ready, click start recording below to begin your journey to a more confident speech.</p>
                    {videoSrc ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <video
                                src={videoSrc}
                                ref={videoRef}
                                controls
                                onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                                playsInline={true}
                                style={{ width: '400px', height: 'auto' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {playing ? (
                                    <button className='hero-button' onClick={handlePause}>Pause</button>
                                ) : (
                                    <div className='hero-button-row'>
                                        {/* {!uploaded && (
                                  <button className='hero-button' onClick={handleUpload}  style={{ marginRight: '10px' }}>Upload</button>
                                    )} */}
                                        {/* <button className='hero-button' onClick={handlePlayback}  style={{ marginRight: '10px' }}>Play</button> */}
                                        {/* <button className='hero-button' onClick={handleReset} >Reset</button> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>Video fetch failed</div>
                            <br />

                            <div>
                                Text Analysis:<br />
                                {new_string}
                            </div>

                        </div>
                    )}
                    {/* {button} */}
                </section>

                <Form.Group id="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" ref={titleRef} required defaultValue={performance.title} />
                </Form.Group>

                {/* Handle form submission */}
                <Form onSubmit={handleSubmit}>
                    {/* Form components (Label & Text Box) for Video Title */}
                    <Form.Group id="title">
                        <Form.Label>Type up your script here</Form.Label>
                        <Form.Control style={{ width: '100%', height: '100%' }} type="text" as='textarea' defaultValue={data.script} ref={scriptRef} />
                    </Form.Group>
                    <div style={{ marginTop: '5px' }}>
                        <Form.Label>Upload script here:&nbsp;</Form.Label>
                        <input type="file" onChange={handleFileSelect} />
                    </div>
                    {/* Disable the submission button if already pressed and submission is in-progress */}
                    <section className="call-to-action">
                        <a className='hero-button' onClick={handleSubmit}>Save Performance</a>
                    </section>
                </Form>

                <section className='hero'>
                    <div>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{new_string}</p>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{new_string2}</p>
                    </div>
                </section>

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default VideoID;