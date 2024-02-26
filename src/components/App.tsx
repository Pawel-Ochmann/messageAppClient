import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import Conversation from './Conversation';
import {io} from 'socket.io-client';

export default function App() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
 
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get token from localStorage
        const token = getToken();

        if (!token) {
          // Redirect to login page if token is not present
          navigate('/login');
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.get(getAddress('/'));
        setUser("Connecting to the server...");
        const socket = io(getAddress('/'));
        socket.emit('join')
       
      } catch (error) {

        navigate('/login');
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const goToSignup = () => {
    navigate('/sign');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <h1>You have been logged!</h1>
      <p>{user.toString()}</p>
      <Conversation messages={[]} socket={socket}/>
      <button onClick={goToSignup}>Go to Signup</button>
      <button onClick={goToLogin}>Go to Login</button>
    </>
  );
}
