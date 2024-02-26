import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddress } from '../utils/serverAddress';
import { saveToken } from '../utils/tokenHandler';
import axios from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    type Data = {
      done:boolean,
      message:string
      token:string
    }

    try {
      const response = await axios.post(getAddress('/login'), {
        username: name,
        password: password,
      });
      const data:Data = response.data;
      console.log('Login successful:', response.data);
       if (data.done === false) {
         setError(data.message);
       } else {
        saveToken(data.token)
         navigate('/');
       }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const redirectToCreateAccount = () => {
    navigate('/sign');
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        {error !== '' ? <p>{error}</p> : ''}
        <div>
          <label>Nickname:</label>
          <input
            type='text'
            value={name}
            onChange={handleNicknameChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      <p>Don't have an account? </p>
      <button onClick={redirectToCreateAccount}>Create Account</button>
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        Go to main Page
      </button>
    </>
  );
};

export default Login;
