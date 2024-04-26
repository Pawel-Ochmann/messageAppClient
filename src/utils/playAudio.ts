export const playAudio = (audioName: string) => {
  const audio = new Audio(`/audio/${audioName}.wav`);
  const volume = localStorage.getItem('volume');
  if (volume) {
    audio.volume = parseInt(volume) / 100;
  }
  audio.play();
};
