import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import { saveToken } from '../utils/tokenHandler';

interface Props{name:string, password:string}

export const loginApi = async ({name, password}:Props) => {
  const response = await axios.post(getAddress('/login'), {
    username: name,
    password: password,
  });
  const data = response.data;
  if (data.done) {
    saveToken(data.token);
  }
  return data;
};