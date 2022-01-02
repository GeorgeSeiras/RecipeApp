const ROOT_URL = 'http://localhost:8000/api';

export async function getMe(dispatch, payload) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${payload.token}`
        }
    };

    try {
        dispatch({ type: 'GET_ME_REQUEST' });
        const response = await fetch(`${ROOT_URL}/user/me`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_ME_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_ME_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_ME_ERROR', errorMessage: error })
    }
}