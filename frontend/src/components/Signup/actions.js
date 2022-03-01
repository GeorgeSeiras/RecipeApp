const API_URL = process.env.REACT_APP_API_URL;

export async function register(dispatch, payload) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'REGISTER_REQUEST' });
        let response = await fetch(`${API_URL}/user/register`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'REGISTER_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'REGISTER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'REGISTER_ERROR', errorMessage: error })
    }
}