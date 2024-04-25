import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import { getToken } from '../utils/tokenHandler';

const axiosInstance = axios.create({
  baseURL: getAddress(''),
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};
