import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: () => void; // Callback function to execute after successful login
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('YOUR_LOGIN_ENDPOINT', {
        nickname: nickname,
        password: password,
      });
      console.log('Login successful:', response.data);
      // Handle successful login, such as storing authentication token
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, such as displaying an error message to the user
    }
  };

  const redirectToCreateAccount = () => {
    navigate('/sign');
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Nickname:</label>
          <input
            type='text'
            value={nickname}
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
      <p>
        Don't have an account?{' '}
        <button onClick={redirectToCreateAccount}>Create Account</button>
      </p>
    </>
  );
};

export default Login;
