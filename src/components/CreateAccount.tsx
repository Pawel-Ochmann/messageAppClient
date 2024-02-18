import { useState } from 'react';
import axios from 'axios';
import { address } from '../../public/serverAddress';

function CreateAccount() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(address, {
        nickname: nickname,
        password: password,
      });
      console.log('Account created successfully:', response.data);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <>
      <h1>Hello</h1>
      <form onSubmit={handleSubmit}>
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
    </>
  );
}

export default CreateAccount;
