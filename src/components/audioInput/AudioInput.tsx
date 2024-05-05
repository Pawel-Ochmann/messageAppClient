import { useState, MouseEventHandler, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../Context';
import {
  faMicrophone,
  faLocationArrow,
  faPause,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import styles from './audioRecorder.module.css';
import classNames from 'classnames';
import { formatTime } from '../../utils/formatTime';
import { useAudioRecord } from '../../hooks/useAudioRecord';

interface Props {
  sendAudio: MouseEventHandler<HTMLButtonElement>;
  audioChunks: Blob[];
  setAudioChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
}

const AudioRecorder = ({ sendAudio, audioChunks, setAudioChunks }: Props) => {
  const { darkTheme } = useContext(UserContext);
  const [timer, setTimer] = useState(0);
  const { recording, startRecording, stopRecording, setRecording } =
    useAudioRecord({
      setAudioChunks,
      setTimer,
    });

  const classes = {
    buttonMain: classNames(styles.buttonMain, {[styles.dark]:darkTheme}),
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
        aria-label={recording ? 'Pause recording' : 'Start recording'}
      >
        {recording ? (
          <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
        )}
      </button>

      <div
        className={classes.audioField}
        aria-hidden={audioChunks.length === 0 && !recording}
      >
        <>
          <button
            onClick={() => {
              setAudioChunks([]);
              setRecording(false);
              setTimer(0);
            }}
            aria-label='Delete the audio'
          >
            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          </button>
          <p>{formatTime(timer)}</p>
          <button
            disabled={audioChunks.length === 0}
            className={classes.buttonSend}
            onClick={sendAudio}
            aria-label='Send audio message'
          >
            <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>
          </button>
        </>
      </div>
    </div>
  );
};

export default AudioRecorder;
