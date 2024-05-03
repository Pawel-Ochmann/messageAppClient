import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import { User } from '../types';

interface Props {
  user: User;
  file: File | null;
}

export const uploadAvatar = async ({ user, file }: Props) => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      await axios.post(getAddress(`/${user.name}/avatar`), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      await axios.post(getAddress(`/${user.name}/avatar`), null);
    }
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
};


