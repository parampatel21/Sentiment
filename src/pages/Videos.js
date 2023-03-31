import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {storage} from '../firebase'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function ViewAllPerformances() {
    const { getuser} = useAuth()
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
        <div>

            <a className='list-button'>{performance.title}</a>
            <a className='list-button' href='performance-id'>Edit</a>
            <a className='list-button' href='performance-id'>View</a>
            <a className='list-button' href='performance-id'>Delete</a>
            {/* <Button href='/script-id' className='button'>{script.text}</Button> */}
            {/* <li key={script.id} onClick={() => handleOptionClick(script)}>{script.text}</li> */}
        </div>
    );
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleDelete = (objectId) => {
        console.log('plus u1tra')
        // axios.delete(`/api/objects/${objectId}`)
        //     .then(() => {
        //         setObjects(objects.filter(object => object.id !== objectId));
        //     })
        //     .catch(error => console.error(error));
    };

    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const videoRef = useRef(null);
  
    const handleStartRecording = () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
  
    const handleUpload = () => {
      const storageRef = storage.ref();
      const fileName = `${Date.now()}.mp4`;
      const UID = getuser()
      const videoRef = storageRef.child(UID + `/${fileName}`);
  
      videoRef.put(videoBlob).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        setUploaded(true);
      });
    };  
  

    return (
        <div className="container-fluid">
            <Navbar />
            <main>
                <div>
                    <h2>Your Performances</h2>
                    <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                        <option value={'byTitle'}>Title</option>
                        <option value={'byDateCreated'}>Date Created</option>
                        <option value={'byDateUpdated'}>Date Updated</option>
                    </select>
                    <button className='sort-button'>Sort By</button>
                    &nbsp;
                    {performances.map(object => (

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a href='/performance-id' style={{ width: '100%' }} className='list-item'>{object.title}</a>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDelete(object.id)}>Delete</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => console.log(`Updating ${object.title}`)}>Update</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => console.log(`Downloading ${object.title}`)}>Download</button>
                            &nbsp;
                        </div>
                    ))}
                </div>

                        {videoSrc ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <video
                    src={videoSrc}
                    ref={videoRef}
                    autoPlay={!playing}
                    onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                    playsInline={true}
                    style={{ width: '400px', height: 'auto' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="range"
                        min={0}
                        max={videoRef.current.duration}
                        step={0.1}
                        value={currentTime}
                        onChange={handleScrub}
                        style={{ width: '400px', margin: '0 10px' }}
                    />
                    {playing ? (
                        <button onClick={handlePause}>Pause</button>
                    ) : (
                        <>
                        {!uploaded && (
                            <button onClick={handleUpload}>Upload</button>
                        )}
                        <button onClick={handlePlayback}>Play</button>
                        </>
                    )}
                    <button onClick={handleReset}>Reset</button>
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
                        <button onClick={handleStopRecording}>Stop Recording</button>
                    ) : (
                        <button onClick={handleStartRecording}>Start Recording</button>
                    )}
                    </div>
                </div>
                )}



            </main >
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div >
    );
}

export default ViewAllPerformances;
