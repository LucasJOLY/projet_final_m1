import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { getMe } from '../store/slice';
import type { AppDispatch, RootState } from '../../store';

interface DecodedToken {
  sub: string;
}

const AuthGuard = ({ Component }: { Component: React.ComponentType<any> }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const authUser = useSelector((state: RootState) => state.auth.authUser);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log(token);
      if (!token) {
        console.log('no token');
        navigate('/login');
        return;
      }
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log('decodedToken', decodedToken);
        const userId: number = Number(decodedToken?.sub);
        console.log('userId', userId);
        if (!userId) {
          navigate('/login');
          return;
        }

        if (!authUser) {
          try {
            const response = await dispatch(getMe(userId));
            if (!response) {
              navigate('/login');
            }
          } catch {
            navigate('/login');
          }
        }
      } catch (error) {
        console.log('error', error);
        navigate('/login');
      }
    };

    verifyAuth();
  }, [token, authUser]);

  return authUser ? <Component /> : null;
};

export default AuthGuard;
