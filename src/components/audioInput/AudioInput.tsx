import { useState, MouseEventHandler, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../Context';
import {
  faMicrophone,
  faLocationArrow,
  faPause,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles/audioRecorder.module.css';
import classNames from 'classnames';

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
  const [timer, setTimer] = useState(0);
  const {darkTheme} = useContext(UserContext);

  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [recording]);

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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  const classes = {
    buttonMain: styles.buttonMain,
    audioField: classNames(
      styles.audioField,
      { [styles.open]: audioChunks.length > 0 || recording },
      { [styles.dark]: darkTheme }
    ),
    buttonSend: classNames(styles.buttonSend, {
      [styles.buttonInactive]: audioChunks.length === 0,
    }),
  };

  return (
    <div>
      <button
        className={classes.buttonMain}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? (
          <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
        )}
      </button>

      <div
        className={classes.audioField}
      >
        <>
          <button
            onClick={() => {
              setAudioChunks([]);
              setRecording(false);
              setTimer(0);
            }}
          >
            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          </button>
          <p>{formatTime(timer)}</p>
          <button
            disabled={audioChunks.length === 0}
            className={classes.buttonSend}
            onClick={sendAudio}
          >
            <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>
          </button>
        </>
      </div>
    </div>
  );
};

export default AudioRecorder;
