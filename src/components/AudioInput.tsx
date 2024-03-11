import { useState } from 'react';
import { SendMessageHandler, MessageParam } from '../types';

const AudioRecorder = ({sendMessage}:{sendMessage:SendMessageHandler}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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

  const handleSendAudio = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'audio_recording.webm', {
      type: 'audio/webm',
    });

    const newMessage:MessageParam = {
        type:'audio',
        content:audioFile
    }
    sendMessage(newMessage);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioChunks.length > 0 && (
        <button onClick={handleSendAudio}>Send Audio</button>
      )}
    </div>
  );
};

export default AudioRecorder;
