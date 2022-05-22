import React, { useReducer, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';

import useError from '../ErrorHandler/ErrorHandler';
import { verifyToken } from '../../actions/VerificationActions';
import { VerificationReducer } from '../../reducers/VerificationReducer';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [token] = useState(searchParams.get('token'))
    const { addError } = useError();
    const [state, reducer] = useReducer(VerificationReducer);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (token) {
                await verifyToken(reducer, token);
            }
        })()
    }, [token])

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage);
        }
    }, [state?.errorMessage])

    useEffect(() => {
        if (state?.success === 'ok') {
            navigate('/login');
        }
    }, [state?.success])
    return (
        <></>
    )
}