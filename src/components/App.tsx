import { useNavigate } from 'react-router-dom'; 

export default function App() {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate('/sign');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <h1>Hello from App</h1>
      <button onClick={goToSignup}>Go to Signup</button>
      <button onClick={goToLogin}>Go to Login</button>
    </>
  );
}
