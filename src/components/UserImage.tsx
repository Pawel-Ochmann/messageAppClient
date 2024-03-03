import { getAddress } from '../utils/serverAddress';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserImage = ({ userName }: { userName: string }) => {
  const imagePath = getAddress(`/${userName}/avatar`);
  const [imageAddress, setImageAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(imagePath);
        if (response.status === 200) {
          setImageAddress(imagePath);
        } else {
          throw new Error('Image not found');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageAddress(null); 
      }
    };

    fetchImage();
  }, [imagePath]);

  return imageAddress ? (
    <img src={imageAddress} alt={`${userName}'s profile`} />
  ) : (
    <button>{userName[0]}</button>
  );
};

export default UserImage;
