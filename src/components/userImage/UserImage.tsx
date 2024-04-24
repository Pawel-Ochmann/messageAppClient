import { getAddress } from '../../utils/serverAddress';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/userImage.module.css';
import {useUploadImage} from '../../hooks/useUploadImage'


const UserImage = ({ userName }: { userName: string }) => {
  const { imageData, isLoading, error, fetchImage } = useUploadImage();

    useEffect(() => {
      fetchImage(getAddress(`/${userName}/avatar`));
    }, [fetchImage, userName]);

  return (
    <div className={styles.imageBox}>
      {isLoading && <FontAwesomeIcon icon={faUser} />}
      {error && <FontAwesomeIcon icon={faUser} />}
      {imageData && <img src={imageData.url} crossOrigin='' alt='' />}
    </div>
  );
};

export default UserImage;
