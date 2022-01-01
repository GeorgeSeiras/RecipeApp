import React, { useState } from 'react';
import Cookies from 'universal-cookie';



export const UserContext = React.createContext({ token: null });


export const AuthProvider = ({ children }) => {
    const cookies = new Cookies();

    let cookieToken = cookies.get('token')
        ? cookies.get('token')
        : null;

    const [user, setUser] = useState({ token: null || cookieToken });

    const login = (token) => {
        setUser((user) => ({
            token: token
        }));
    };

    const logout = () => {
        setUser((user) => ({
            token: null
        }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
