import { getAddress } from '../utils/serverAddress';
import { useState } from 'react';
import { ConversationType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/userImage.module.css';
const GroupImage = ({ conversation }: { conversation:ConversationType }) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getGroupImage = () => {
     return getAddress(`/group/${conversation.key}`);
  };

  return (
    <div className={styles.imageBox}>
      {' '}
      {imageLoaded ? (
        <img
          src={getGroupImage()}
          alt=''
          style={{ width: '100px' }}
          onLoad={handleImageLoad}
          onError={() => setImageLoaded(false)}
          crossOrigin=''
        />
      ) : (
        <FontAwesomeIcon icon={faUserGroup} />
      )}
    </div>
  );
};

export default GroupImage;
