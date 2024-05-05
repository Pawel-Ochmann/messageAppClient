import styles from './settings.module.css';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../../utils/tokenHandler';
import axios from 'axios';
import { useContext, Dispatch, SetStateAction, useState } from 'react';
import { UserContext } from '../../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPenToSquare,
  faRotateLeft,
  faDownload,
  faMusic,
  faCircleHalfStroke,
  faRightFromBracket,
  faVolumeXmark,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import UserImage from '../userImage/UserImage';
import classNames from 'classnames';
import { uploadAvatar } from '../../api/uploadAvatarApi';

interface Props {
  className: string;
  openHandler: Dispatch<SetStateAction<boolean>>;
}

const Settings = ({ className, openHandler }: Props) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { darkTheme, setDarkTheme } = useContext(UserContext);
  const [file, setFile] = useState<File | null>(null);
  const [volume, setVolume] = useState<number>(() => {
    const storedVolume = localStorage.getItem('volume');
    return storedVolume ? parseInt(storedVolume) : 50;
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const success = await uploadAvatar({ user, file });
      if (success) {
        setFile(null);
        location.reload();
      }
    } catch (error) {
      console.error('Error handling form submit:', error);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    localStorage.setItem('volume', newVolume.toString());
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const theme = event.target.value === 'dark';
    setDarkTheme(theme);
  };

  const logOut = () => {
    deleteToken();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const classes = {
    container: classNames(
      className,
      styles.container,
      {
        [styles.dark]: darkTheme,
      },
      { [styles.hidden]: className === '' }
    ),
    header: classNames(styles.header, { [styles.dark]: darkTheme }),
    buttonBack: styles.buttonBack,
    userInfo: styles.userInfo,
    imageInput: styles.imageInput,
    settingsContainer: styles.settingsContainer,
    audio: styles.audio,
    audioTitle: styles.audioTitle,
    theme: styles.theme,
    themeTitle: styles.themeTitle,
    logout: styles.logout,
  };

  return (
    <div aria-hidden={className === ''} className={classes.container}>
      <header className={classes.header}>
        <button
          className={classes.buttonBack}
          onClick={() => openHandler(false)}
          aria-label='Go back'
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <h2>Settings</h2>
      </header>
      <div className={classes.userInfo}>
        <h1>{user.name}</h1>
        <div className={classes.imageInput}>
          {file ? (
            <img src={URL.createObjectURL(file)} alt='' />
          ) : (
            <UserImage userName={user.name} />
          )}
          <label htmlFor='avatar' aria-label='Change image of the user'>
            <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
          </label>
        </div>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <input
            id='avatar'
            type='file'
            name='avatar'
            accept='image/jpeg, image/png, image/gif'
            onChange={handleFileChange}
          />
          {file && (
            <>
              <button
                onClick={() => {
                  setFile(null);
                }}
                type='reset'
                aria-label='Remove image'
              >
                <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
              </button>
              <button type='submit' aria-label='Set image'>
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </button>
            </>
          )}
        </form>
      </div>
      <div className={classes.settingsContainer}>
        <div className={classes.audio}>
          <div className={classes.audioTitle}>
            <FontAwesomeIcon icon={faMusic}></FontAwesomeIcon> <p>Audio</p>
          </div>
          <span>
            <FontAwesomeIcon icon={faVolumeXmark}></FontAwesomeIcon>
            <input
              type='range'
              id='volume'
              name='volume'
              min='0'
              max='100'
              value={volume}
              onChange={handleVolumeChange}
              aria-label='Set volume'
            />
            <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
          </span>
        </div>
        <div className={classes.theme}>
          <div className={classes.themeTitle}>
            <FontAwesomeIcon icon={faCircleHalfStroke}></FontAwesomeIcon>
            <p>Theme</p>
          </div>
          <form>
            <label>
              <input
                type='radio'
                name='theme'
                value='light'
                checked={!darkTheme}
                onChange={handleThemeChange}
              />
              Light Theme
            </label>
            <label>
              <input
                type='radio'
                name='theme'
                value='dark'
                checked={darkTheme}
                onChange={handleThemeChange}
              />
              Dark Theme
            </label>
          </form>
        </div>
        <div className={classes.logout}>
          <button onClick={logOut}>
            <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>Log out
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
