import React, { useReducer } from 'react';
import { AuthReducer, initialState } from './reducer';

export const AuthContext = React.createContext();

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

export function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error("useAuthState must be used within an authenticator")
    }

    return context;
}

export function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error("useAuthDispatch must be used within an AuthProvider")
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [token, dispatch] = useReducer(AuthReducer, initialState);

    return (
        <AuthStateContext.Provider value={token}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};
