import React, { useState, useContext } from 'react';
import { UserContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { getAddress } from '../../utils/serverAddress';
import { saveToken } from '../../utils/tokenHandler';
import axios from 'axios';
import styles from './styles/login.module.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {darkTheme} = useContext(UserContext);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    type Data = {
      done: boolean;
      message: string;
      token: string;
    };

    try {
      const response = await axios.post(getAddress('/login'), {
        username: name,
        password: password,
      });
      const data: Data = response.data;
      console.log('Login successful:', response.data);
      if (data.done === false) {
        setError(data.message);
      } else {
        saveToken(data.token);
        navigate('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
       if (error.response.status === 401) {
         setError('Invalid username or password');
       } else {
         console.error('Login failed:', error);
       }
      
    }
  };

  const redirectToCreateAccount = () => {
    navigate('/sign');
  };

  return (
    <div className={`${styles.container} ${darkTheme && styles.dark}`}>
    <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <p className={styles.error}>{error}</p> 
        <div>
          <input
            placeholder='Nickname'
            type='text'
            value={name}
            onChange={handleNicknameChange}
            required
          />
        </div>
        <div>
          <input
            placeholder='Password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button className={styles.buttonMain} type='submit'>Login to your account</button>
      </form>
      <p>OR</p>
      <button className={styles.buttonSecond} onClick={redirectToCreateAccount}>Create new account</button>
    </div>
  );
};

export default Login;
