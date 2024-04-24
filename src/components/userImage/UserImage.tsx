import { getAddress } from '../utils/serverAddress';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/userImage.module.css';
const UserImage = ({ userName }: { userName: string }) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getContactImage = () => {
    return getAddress(`/${userName}/avatar`);
  };

  return (
    <div className={styles.imageBox}>
      {' '}
      {imageLoaded ? (
        <img
          src={getContactImage()}
          crossOrigin=''
          alt=''
          onLoad={handleImageLoad}
          onError={() => setImageLoaded(false)}
        />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  );
};

export default UserImage;
