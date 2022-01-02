import React, { useState, useReducer, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { getMe } from './actions';
import { GetMeReducer } from './reducer'


export const UserContext = React.createContext({ token: null });

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GetMeReducer);
    const [data, setData] = useState({ token: null, user: null });

    useEffect(() => {
        const cookies = new Cookies();
        let cookieToken = cookies.get('token')
            ? cookies.get('token')
            : null;

        var userData = null;
        if (cookieToken) {
            const payload = {
                "token": cookieToken
            };
            getMe(dispatch, payload).then(res => userData = res);
        }
        setData({ token: cookieToken, user: userData })
    }, [dispatch])

    const [user, setUser] = useState({ user: null || data.user, token: null || data.token });

    const login = (token) => {
        setUser((user) => ({
            token: user.token,
            user: user.user
        }));
    };

    const logout = () => {
        setUser((user) => ({
            token: null,
            user: null
        }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
