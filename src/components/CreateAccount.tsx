import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAddress } from '../utils/serverAddress';
import styles from './styles/login.module.css';
import { UserContext } from '../Context';

function CreateAccount() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {darkTheme} = useContext(UserContext);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      type Data = {
        done: boolean;
        message: string;
      };

      const response = await axios.post(getAddress('/signup'), {
        name: nickname,
        password: password,
      });
      console.log('Account created successfully:');
      const data: Data = response.data;
      if (data.done === false) {
        setError(data.message);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div className={`${styles.container} ${darkTheme && styles.dark}`}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        {error !== '' ? <p>{error}</p> : ''}
        <div>
          <input
            placeholder='Nickname'
            type='text'
            value={nickname}
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
        <button className={styles.buttonMain} type='submit'>
          Create new account
        </button>
      </form>
      <p>OR</p>
      <button
        className={styles.buttonSecond}
        onClick={() => {
          navigate('/login');
        }}
      >
        Log in to your account
      </button>
    </div>
  );
}

export default CreateAccount;
