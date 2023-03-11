import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const webcamRef = useRef(null);
  const recorderRef = useRef(null);

  const handleStartRecording = () => {
    setRecording(true);
    const webcam = webcamRef.current.video;
    const recorder = RecordRTC(webcam, {
      type: 'video',
      mimeType: 'video/webm',
    });
    recorderRef.current = recorder;
    recorder.startRecording();
  };

  const handleStopRecording = () => {
    setRecording(false);
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      setRecordedBlob(blob);
    });
  };

  const handleDownloadRecording = () => {
    console.log(recordedBlob)
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <button onClick={handleStartRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={handleStopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {recordedBlob && (
        <button onClick={handleDownloadRecording}>
          Download Recording
        </button>
      )}
    </div>
  );
};

export default VideoRecorder;
