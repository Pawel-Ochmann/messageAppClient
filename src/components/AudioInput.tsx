import { useState, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/audioRecorder.module.css'

const AudioRecorder = ({
  sendAudio,
  audioChunks,
  setAudioChunks,
}: {
  sendAudio: MouseEventHandler<HTMLButtonElement>;
  audioChunks: Blob[];
  setAudioChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
 

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

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? (
          'Stop Recording'
        ) : (
          <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
        )}
      </button>
      {audioChunks.length > 0 && (
        <button onClick={sendAudio}>Send Audio</button>
      )}
      <div></div>
    </div>
  );
};

export default AudioRecorder;
