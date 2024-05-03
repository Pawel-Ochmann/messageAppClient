import React, { useState, useContext } from 'react';
import { UserContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import classNames from 'classnames';
import { loginApi } from '../../api/loginApi';
import { AxiosError } from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkTheme } = useContext(UserContext);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {

      const success = await loginApi({ name, password });
   
      if (!success) {
        throw new Error('failed to login');
      } else {
        navigate('/');
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  const redirectToCreateAccount = () => {
    navigate('/sign');
  };

  const classes = {
    container: classNames(styles.container, { [styles.dark]: darkTheme }),
    error: styles.error,
    buttonMain: styles.buttonMain,
    buttonSecond: styles.buttonSecond,
  };

  return (
    <div className={classes.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <p className={classes.error}>{error}</p>
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
        <button className={classes.buttonMain} type='submit'>
          Login to your account
        </button>
      </form>
      <p>OR</p>
      <button
        className={classes.buttonSecond}
        onClick={redirectToCreateAccount}
      >
        Create new account
      </button>
    </div>
  );
};

export default Login;
