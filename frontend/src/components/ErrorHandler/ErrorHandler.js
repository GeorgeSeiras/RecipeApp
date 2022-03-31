import React, { useState, createContext, useCallback, useContext } from 'react';

export const ErrorStatusContext = createContext();

export const ErrorHandler = ({ children }) => {
    const [error, setError] = useState([]);

    const addError = (message) => {
        setError(error=>[...error,message])
    }

    const contextValue = {
        error,
        addError: useCallback((message) => addError(message), []),
    };

    return (
        <ErrorStatusContext.Provider value={contextValue}>
            {children}
        </ErrorStatusContext.Provider>
    )
}

export default function useError() {
    const { error, addError } = useContext(ErrorStatusContext);
    return { error, addError }
}