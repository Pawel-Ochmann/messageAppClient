import styles from './styles/settings.module.css';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../utils/tokenHandler';
import axios from 'axios';
import { useContext, Dispatch, SetStateAction, useState } from 'react';
import { UserContext } from '../Context';
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
import UserImage from './UserImage';
import { User } from '../types';
import { getAddress } from '../utils/serverAddress';

const Settings = ({
  className,
  openHandler,
}: {
  className: string;
  openHandler: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext) as {
    user: User;
    setUser: Dispatch<SetStateAction<User | null>>;
  };

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
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        console.log(file);
        await axios.post(getAddress(`/${user.name}/avatar`), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        location.reload();
      } else {
        await axios.post(getAddress(`/${user.name}/avatar`), null);
      }

      setFile(null);
      location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    localStorage.setItem('volume', newVolume.toString());
  };

  const logOut = () => {
    deleteToken();
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };
  return (
    <div className={`${className} ${styles.container}`}>
      <header className={styles.header}>
        <button
          className={styles.buttonBack}
          onClick={() => openHandler(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <h2>Settings</h2>
      </header>
      <div className={styles.userInfo}>
        <h1>{user.name}</h1>
        <div className={styles.imageInput}>
          {file ? (
            <img src={URL.createObjectURL(file)} alt='' />
          ) : (
            <UserImage userName={user.name} />
          )}
          <label htmlFor='avatar'>
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
          <div>
            {file && (
              <>
                <button
                  onClick={() => {
                    setFile(null);
                  }}
                  type='reset'
                >
                  <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
                </button>
                <button type='submit'>
                  <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      <div className={styles.settingsContainer}>
        <div className={styles.audio}>
          <button>
            <FontAwesomeIcon icon={faMusic}></FontAwesomeIcon> Audio
          </button>
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
            />
            <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
          </span>
        </div>
        <div className={styles.theme}>
          <button>
            <FontAwesomeIcon icon={faCircleHalfStroke}></FontAwesomeIcon>Theme
          </button>
        </div>
        <div className={styles.logout}>
          <button onClick={logOut}>
            <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>Log out
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
