import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';


export const UserContext = React.createContext({ token: null });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ user: null, token: null });

    const ROOT_URL = 'http://localhost:8000/api';

    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get('token')
            ? cookies.get('token')
            : null;
        if (token) {

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '.concat(token.key)
                }
            };
            fetch(`${ROOT_URL}/user/me`, requestOptions)
                .then(res => res.json())
                .then(data => setUser({
                    user: data.user,
                    token: token
                }))
        }
    }, [])

    const login = (data) => {
        setUser((user) => ({
            token: data.token,
            user: data.user
        }));
    };

    const logout = () => {
        setUser((user) => ({
            token: null,
            user: null
        }));
        cookies.remove('token',{path:'/'});
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
