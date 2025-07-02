import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import type { AppDispatch, RootState } from '../../store';
import { getMe } from '../../auth/store/slice';

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
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId: number = Number(decodedToken?.sub);
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
        console.log(authUser?.is_admin);
      } catch (error) {
        navigate('/login');
      }
    };

    verifyAuth();
  }, [token, authUser]);

  return authUser && authUser.is_admin ? <Component /> : null;
};

export default AuthGuard;
