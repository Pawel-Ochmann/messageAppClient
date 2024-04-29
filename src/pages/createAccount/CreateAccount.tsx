import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './createAccount.module.css';
import { UserContext } from '../../Context';
import classNames from 'classnames';
import { createAccountApi } from '../../api/createAccountApi';

function CreateAccount() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkTheme } = useContext(UserContext);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setNickname(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = await createAccountApi({ nickname, password });

      if (!data.done) {
        setError(data.message);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const classes = {
    container: classNames(styles.container, { [styles.dark]: darkTheme }),
    error: styles.error,
    buttonMain: styles.buttonMain,
    buttonSecond: styles.buttonSecond,
  };

  return (
    <div className={classes.container}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <p className={classes.error}>{error}</p>
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
        <button className={classes.buttonMain} type='submit'>
          Create new account
        </button>
      </form>
      <p>OR</p>
      <button
        className={classes.buttonSecond}
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
