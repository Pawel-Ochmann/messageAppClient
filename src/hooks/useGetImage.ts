import { useState } from 'react';
import axios from 'axios';
import { getAddress } from '../utils/serverAddress';

export const useGetImage = (imageAddress: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = async () => {
    setIsLoading(true);
    try {
      const response = await axios(getAddress(imageAddress));
      if (!response.data || response.status !== 200) {
        throw new Error('Failed to fetch image');
      }
      setImageSrc(getAddress(imageAddress));
      setError(null);
      return;
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || 'Failed to fetch image');
      return
    } finally {
      setIsLoading(false);
    }
  };

  return { imageSrc, isLoading, error, fetchImage };
};
