const ROOT_URL = 'http://localhost:8000/api';

export async function getUser(dispatch, payload) {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        dispatch({ type: 'USER_REQUEST' });
        let response = await fetch(`${ROOT_URL}/user/${payload.username}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'USER_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_ERROR', errorMessage: error })
    }
}