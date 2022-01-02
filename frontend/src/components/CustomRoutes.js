import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from './Context/authContext'

export const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    return user?.token ? children : <Navigate to='/login' />
}

export const NoLoggedInRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    console.log(user)
    return user?.token ? <Navigate to='/home' /> : children
}