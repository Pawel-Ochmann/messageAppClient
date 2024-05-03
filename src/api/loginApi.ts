import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import { saveToken } from '../utils/tokenHandler';

interface Props {
  name: string;
  password: string;
}

export const loginApi = async ({ name, password }: Props) => {
  try {
    const response= await axios.post(
      getAddress('/login'),
      {
        username: name,
        password: password,
      }
    );

    const token: string = response.data.token;

    if (response.status === 200) {
      saveToken(token);
      return true; 
    } else {
      throw new Error('Login request failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    return false; 
  }
};
