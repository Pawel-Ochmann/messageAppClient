import { useEffect } from 'react';
import { ConversationType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from '../userImage/userImage.module.css';
import { useGetImage } from '../../hooks/useGetImage';

interface Props {
  conversation: ConversationType;
}

const GroupImage = ({ conversation }: Props) => {
  const { imageSrc, isLoading, error, fetchImage } = useGetImage(
    `/group/${conversation.key}`
  );

  useEffect(() => {
    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className={styles.imageBox}>
      {isLoading && <FontAwesomeIcon icon={faUserGroup} />}
      {error && <FontAwesomeIcon icon={faUserGroup} />}
      {imageSrc && <img src={imageSrc} crossOrigin='' alt='' />}
    </div>
  );
};

export default GroupImage;
