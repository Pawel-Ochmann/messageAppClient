import axios from 'axios';
import { getAddress } from '../utils/serverAddress';

interface Props{nickname:string, password:string}

export const createAccountApi = async ({nickname, password}:Props) => {
  try {
    const response = await axios.post(getAddress('/signup'), {
      name: nickname,
      password: password,
    });
    console.log('Account created successfully:');
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};
