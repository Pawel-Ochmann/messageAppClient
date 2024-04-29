import { useState, useEffect } from 'react';

interface AudioRecord {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  setAudioChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
}

export const useAudioRecord = ({setAudioChunks, setTimer}:Props): AudioRecord => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [recording, setTimer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return { recording, startRecording, stopRecording, setRecording };
};

