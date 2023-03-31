 import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VideoRecorder from './components/VideoRecorder'
import '../styles/styles.css'
import '../styles/HomePage.css'
import {storage} from '../firebase'
import Navbar from './components/Navbar'

function Record() {
    const scriptRef = useRef();
    const { getuser, isAuthenticated, logout } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const videoRef = useRef(null);
  
    const handleStartRecording = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
  
          const mediaRecorder = new MediaRecorder(mediaStream);
          const chunks = [];
  
          mediaRecorder.addEventListener('dataavailable', (event) => {
            chunks.push(event.data);
          });
  
          mediaRecorder.addEventListener('stop', () => {
            const videoBlob = new Blob(chunks, { type: 'video/mp4' });
            setVideoBlob(videoBlob);
            setVideoSrc(URL.createObjectURL(videoBlob));
            setRecording(false);
          });
  
          mediaRecorder.start();
          setRecording(true);
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    };
  
    const handleStopRecording = () => {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
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

    async function handleLogout() {
        setError('')

        try {
            await logout()
            // navigate('/login')
            window.location.reload();
        } catch {
            setError('Failed to log out')
        }
    }

    // Function to handle user interaction with the save button
    async function handleSubmit(e) {
        e.preventDefault()

        const handleUpload = () => {
            if (!videoBlob) {
                alert("No video has been recorded.");
                return;
            }
                
          const storageRef = storage.ref();
          const fileName = `${Date.now()}.mp4`;
          const UID = getuser()
          const videoRef = storageRef.child(UID + `/${fileName}`);
      
          videoRef.put(videoBlob).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            setUploaded(true);
          });
        };  

        async function handleScriptUpload() {
            console.log('to be implemented')
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
            setError('Failed to upload the video')
        }

        setLoading(false)

    }

    function handleFileSelect(event) {
        const fileList = event.target.files;
        // Do something with the file here
        console.log(fileList);
    }

        // const [buttonText, setButtonText] = useState("Start Recording");
        // let button;
        // if (buttonText == 'Start Recording') {
        //     button = <a className='hero-button' onClick={() => setButtonText("Stop Recording")}>{buttonText}</a>
        // } else {
        //     button = <a className='hero-button' onClick={() => setButtonText("Start Recording")}>{buttonText}</a>
        // }


        return (
            <div className="container-fluid">
                <Navbar />
        
                <main>
                    <section className="hero">
                        <h1>Welcome to your Recording Session</h1>
                        <p>Here you can record a video performance of your public speaking skills and have your technique analyzed via facial and tonal analysis.</p>
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
                              <button className='hero-button' onClick={handleReset} >Reset</button>
                            </div>
                        )}
                        </div>
                    </div>
                    ) : (
                    <div>
                        <video
                        ref={videoRef}
                        autoPlay={true}
                        muted={true}
                        playsInline={true}
                        style={{ width: '400px', height: 'auto' }}
                        />
                        <div>
                        {recording ? (
                            <button className='hero-button' onClick={handleStopRecording}>Stop Recording</button>
                        ) : (
                            <button className='hero-button' onClick={handleStartRecording}>Start Recording</button>
                        )}
                        </div>
                    </div>
                    )}
                        {/* {button} */}
                    </section>
        
                    {/* Handle form submission */}
                    <Form onSubmit={handleSubmit}>
                        {/* Form components (Label & Text Box) for Video Title */}
                        <Form.Group id="title">
                            <Form.Label>Type up your script here</Form.Label>
                            <Form.Control style={{ width: '100%', height: '100%' }} type="text" as='textarea' ref={scriptRef} />
                        </Form.Group>
                        <div style={{ marginTop: '5px' }}>
                            <Form.Label>Upload script here:&nbsp;</Form.Label>
                            <input type="file" onChange={handleFileSelect} />
                        </div>
                        {/* Disable the submission button if already pressed and submission is in-progress */}
                        <section className="call-to-action">
                            <a className='hero-button' href='/performance-id'>Save Performance</a>
                        </section>
                    </Form>

            </main>
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Record;