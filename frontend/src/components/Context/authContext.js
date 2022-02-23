import React, { useState, useEffect, createContext } from 'react';
import Cookies from 'universal-cookie';


export const UserContext = createContext({ user: null, token: null, isAuth: null });

export const AuthProvider = ({ children }) => {

    const cookies = new Cookies();

    const [user, setUser] = useState({
        user: null,
        token: cookies.get('token')
            ? cookies.get('token')
            : null,
        isAuth: null
    });
    const ROOT_URL = 'http://localhost:8000/api';

    useEffect(() => {
        (async () => {
            if (user.token) {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer '.concat(user.token.key)
                    }
                };
                await fetch(`${ROOT_URL}/user/me`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        setUser({...user,
                            user: data.user,
                            isAuth:true
                        })
                    }).catch(() => setUser({ ...user, isAuth: false }))
            } else {
                setUser({ ...user, isAuth: false })
            }
        })()
    }, [])

    const login = (data) => {
        setUser((user) => ({
            token: data.token,
            user: data.user,
            isAuth: true
        }));
    };

    const logout = () => {
        setUser((user) => ({
            token: null,
            user: null,
            isAuth: false
        }));
        cookies.remove('token', { path: '/' });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </ UserContext.Provider>
    );
};