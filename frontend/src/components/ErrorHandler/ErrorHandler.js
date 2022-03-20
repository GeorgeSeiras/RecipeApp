import React, { useState, createContext, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

export const ErrorStatusContext = createContext();

export const ErrorHandler = ({ children }) => {
    const [error, setError] = useState();

    const renderContent = () => {
        if (error) {
            return (
                <Container style={{
                    margin: '0', position: 'absolute', top: '50%', left: '50%', msTransform: 'translate(-50%, -50%)',
                    transform: 'translate(-50%, -50%)', justifyContent:'center',display:'flex'
                }}>
                    <Alert variant={'danger'}>
                        {error.status_code}: {error.message}
                    </Alert>
                </Container>
            )
        }

        return children;
    }

    const contextPayload = useMemo(
        () => ({ setError }),
        [setError]
    );

    return (
        <ErrorStatusContext.Provider value={contextPayload}>
            {renderContent()}
        </ErrorStatusContext.Provider>
    )
}

export const useError = () => useContext(ErrorStatusContext)