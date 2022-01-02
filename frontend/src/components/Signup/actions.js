const ROOT_URL = 'http://localhost:8000/api';

export async function register(dispatch, payload) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        await dispatch({ type: 'REGISTER_REQUEST' });
        let response = await fetch(`${ROOT_URL}/user/register`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            await dispatch({ type: 'REGISTER_SUCCESS', payload: data.result })
            return data
        }
        await dispatch({ type: 'REGISTER_ERROR', errorMessage: data })
    } catch (error) {
        await dispatch({ type: 'REGISTER_ERROR', errorMessage: error })
    }
}