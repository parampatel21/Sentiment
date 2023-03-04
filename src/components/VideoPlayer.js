import React, { useState, useEffect } from "react";
import { storage } from "../firebase";

const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const storageRef = storage.ref();
    const videoRef = storageRef.child("gs://sentiment-6696b.appspot.com/uid3_1_temp.mp4");

    videoRef.getDownloadURL().then((url) => {
      setVideoUrl(url);
    });
  }, []);

  return (
    <div>
      <video controls>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;