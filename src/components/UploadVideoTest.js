// THIS FILE IS DEPRECATED AND WILL BE DELETED SOON - PARAM

import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

export default function UploadVideoTest() {
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      return;
    }

    // Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyBeGxpyW7-XKT4scH41JCzn2Tzb3s7sveY",
        authDomain: "sentiment-6696b.firebaseapp.com",
        databaseURL: "https://sentiment-6696b-default-rtdb.firebaseio.com",
        projectId: "sentiment-6696b",
        storageBucket: "sentiment-6696b.appspot.com",
        messagingSenderId: "929145383886",
        appId: "1:929145383886:web:4059c05a3f9aebca45199f",
        measurementId: "G-38C03L0RC1"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Upload video to Firebase Storage
    const storageRef = firebase.storage().ref();
    const videoRef = storageRef.child(videoFile.name);
    await videoRef.put(videoFile);

    // Get the public URL of the uploaded video
    const downloadURL = await videoRef.getDownloadURL();

    console.log(downloadURL); // You can use this URL to display the video to the user or store it in a database
  };

  return (
    <div>
      <input type="file" onChange={handleVideoFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};



