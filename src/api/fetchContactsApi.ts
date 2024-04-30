import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import { getToken } from '../utils/tokenHandler';
import { User } from '../types';


export const fetchContactsApi = async (user:User) => {
  const token = getToken();

     if (!token) {
       throw new Error('No token available');
     }

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const response = await axios.get(getAddress(`/contacts/${user.name}`));
  return response.data;
};
