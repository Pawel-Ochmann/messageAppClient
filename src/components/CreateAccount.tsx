import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAddress } from '../utils/serverAddress';

function CreateAccount() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <>
      <h1>Hello</h1>
      <form onSubmit={handleSubmit}>
        {error !== '' ? <p>{error}</p> : ''}
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
        <button type='submit'>Create Account</button>
      </form>
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        Go to main Page
      </button>
    </>
  );
}

export default CreateAccount;
