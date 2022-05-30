const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

export async function verifyToken(dispatch, token) {
    const requestOptions = {
        method: 'GET',
    };
    try {
        const response = await fetch(`${API_URL}/verification/${token}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'VERIFY_TOKEN', payload: data.result })
            return data
        }
        dispatch({ type: 'TOKEN_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'TOKEN_ERROR', errorMessage: error })
    }
}

export async function newToken(dispatch, payload) {

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`${API_URL}/verification/new`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'NEW_TOKEN', payload: data.result })
            return data
        }
        dispatch({ type: 'TOKEN_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'TOKEN_ERROR', errorMessage: error })
    }
}