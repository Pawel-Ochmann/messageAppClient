import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './userImage.module.css';
import { useGetImage } from '../../hooks/useGetImage';
import { useEffect } from 'react';

interface Props {
  userName: string;
}

const UserImage = ({ userName }: Props) => {
  const { imageSrc, isLoading, error, fetchImage } = useGetImage(
    `/${userName}/avatar`
  );

  useEffect(()=>{
    fetchImage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.imageBox}>
      {isLoading && <FontAwesomeIcon icon={faUser} />}
      {error && <FontAwesomeIcon icon={faUser} />}
      {imageSrc && (
        <img src={imageSrc} crossOrigin='' alt='' />
      )}
    </div>
  );
};

export default UserImage;
