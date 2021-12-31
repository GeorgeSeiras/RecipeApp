import { Navigate } from "react-router-dom";

import { useAuthState } from './Context'

export const PrivateRoute = ({ children }) => {
    let userDetails = useAuthState()
    return userDetails.token ? children : <Navigate to='/login' />
}

export const NoLoggedInRoute = ({ children }) => {
    let userDetails = useAuthState();
    return userDetails.token ? <Navigate to='/home' /> : children
}