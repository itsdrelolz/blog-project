
import { useContext } from 'react';
import AuthContext, { AuthContextType } from './AuthContext'; 

const useAuth = () => useContext(AuthContext) as AuthContextType;

export default useAuth;