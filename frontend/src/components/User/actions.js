const API_URL = process.env.REACT_APP_API_URL;

export async function getUser(dispatch, username) {

    const requestOptions = {
        method: 'GET'
    };

    try {
        dispatch({ type: 'GET_USER_REQUEST' });
        let response = await fetch(`${API_URL}/user/${username}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_USER_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_USER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_USER_ERROR', errorMessage: error })
    }
}