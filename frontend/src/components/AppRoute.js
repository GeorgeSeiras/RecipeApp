import React from "react";
import { useNavigate, Route } from "react-router-dom";

import { useAuthState } from './Context'

const AppRoute = ({ isPrivate, children }) => {
    const navigate = useNavigate();
    let userDetails = useAuthState()
    if (isPrivate) {
        return userDetails.token ? children : navigate('/login')
    } else {
        return children
    }
}
export default AppRoute