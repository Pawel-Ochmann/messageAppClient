import { getAddress } from '../../utils/serverAddress';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './userImage.module.css';
import {useGetImage} from '../../hooks/useGetImage'

interface Props {userName:string}

const UserImage = ({ userName }: Props) => {
  const { imageData, isLoading, error, fetchImage } = useGetImage();

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
