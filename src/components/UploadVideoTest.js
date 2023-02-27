import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      return;
    }

    // Initialize Firebase
    const firebaseConfig = {
      // Add your Firebase project configuration here
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

export default UploadVideo;
