import { getAddress } from '../../utils/serverAddress';
import { useEffect } from 'react';
import { ConversationType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/userImage.module.css';
import { useUploadImage } from '../../hooks/useUploadImage';

interface Props {
  conversation: ConversationType;
}

const GroupImage = ({ conversation }: Props) => {
  const { imageData, isLoading, error, fetchImage } = useUploadImage();

  useEffect(() => {
    fetchImage(getAddress(`/group/${conversation.key}`));
  }, [conversation.key, fetchImage]);

  return (
    <div className={styles.imageBox}>
      {isLoading && <FontAwesomeIcon icon={faUserGroup} />}
      {error && <FontAwesomeIcon icon={faUserGroup} />}
      {imageData && <img src={imageData.url} crossOrigin='' alt='' />}
    </div>
  );
};

export default GroupImage;
