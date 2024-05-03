import { ReactNode, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api/userApi';
import { UserContext } from '../Context';

interface Props {
  children: ReactNode;
}

export default function AuthorizationProvider({ children }: Props) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await fetchUserData();
        setUser(data);
      } catch (error) {
        navigate('/login');
        return;
      }
    };

    if (user.name === '') checkLoggedIn();
  }, [navigate, setUser, user]);

  return <>{children}</>;
}
