import { getAddress } from '../../utils/serverAddress';
import { useEffect } from 'react';
import { ConversationType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './userImage.module.css';
import { useGetImage } from '../../hooks/useGetImage';

interface Props {
  conversation: ConversationType;
}

const GroupImage = ({ conversation }: Props) => {
  const { imageData, isLoading, error, fetchImage } = useGetImage();

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
