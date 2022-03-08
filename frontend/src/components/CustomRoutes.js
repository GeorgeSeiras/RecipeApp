import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from './Context/authContext'

export const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user.isAuth === null) {
        return null
    }
    return user.isAuth ? children : <Navigate to='/login' />
}

export const NoLoggedInRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user.isAuth === null) {
        return null
    }
    return user.isAuth ? <Navigate to='/' /> : children
}

export const NormalRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user.isAuth === null) {
        return null
    }
    return children
}