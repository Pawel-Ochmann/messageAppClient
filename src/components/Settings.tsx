import styles from './styles/settings.module.css';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../utils/tokenHandler';
import axios from 'axios';
import { useContext, Dispatch, SetStateAction, useState } from 'react';
import { UserContext } from '../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UserImage from './UserImage';
import { User } from '../types';
import { getAddress } from '../utils/serverAddress';

const Contacts = ({
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
        <div className={styles.imageInput}>
          {file ? (
            <img src={URL.createObjectURL(file)} alt='' />
          ) : (
            <UserImage userName={user.name} />
          )}

          <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <label htmlFor='avatar'>
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </label>
            <input
              id='avatar'
              type='file'
              name='avatar'
              accept='image/jpeg, image/png, image/gif'
              onChange={handleFileChange}
            />
            <button type='submit'> Send</button>
          </form>
        </div>

        <h1>{user.name}</h1>
      </div>
      <div className={styles.settingsContainer}>
        <button>Audio</button>
        <button>Theme</button>
        <button onClick={logOut}>log out</button>
      </div>
    </div>
  );
};
export default Contacts;
