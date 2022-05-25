import React, { useState, useEffect, createContext } from 'react';
import Cookies from 'universal-cookie';


export const UserContext = createContext({ user: null, token: null, isAuth: null });

export const AuthProvider = ({ children }) => {
    const API_URL = process.env.REACT_APP_API_URL
    const cookies = new Cookies();

    const [user, setUser] = useState({
        user: null,
        token: cookies.get('token')
            ? cookies.get('token')
            : null,
        isAuth: null
    });

    useEffect(() => {
        (async () => {
            if (user?.token) {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer '.concat(user.token.key)
                    }
                };
                const response = await fetch(`${API_URL}/user/me`, requestOptions)
                if (response.status !== 200) {
                    cookies.remove('token', { path: '/' });
                }
                const data = await response.json()
                console.log(data)
                setUser({
                    ...user,
                    user: data.user,
                    isAuth: true
                })
            } else {
                setUser({ ...user, isAuth: false })
            }
        })()
    }, [])

    const login = (data) => {
        setUser((user) => ({
            token: cookies.get('token'),
            user: data.user,
            isAuth: true
        }));
    };

    const logout = () => {
        setUser((user) => ({
            token: null,
            user: null,
            isAuth: false
        }))
        cookies.remove('token', { path: '/' });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </ UserContext.Provider>
    );
};