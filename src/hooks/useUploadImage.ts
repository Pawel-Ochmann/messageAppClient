import { useState } from 'react';
import axios from 'axios';

interface ImageData {
  url: string;
}

export const useUploadImage = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = async (imageUrl: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ImageData>(imageUrl);

      if (!response.data || response.status !== 200) {
        throw new Error('Failed to fetch image');
      }

      setImageData(response.data);
      setError(null);
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || 'Failed to fetch image');
    } finally {
      setIsLoading(false);
    }
  };

  return { imageData, isLoading, error, fetchImage };
};

