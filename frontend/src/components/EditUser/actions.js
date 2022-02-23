const ROOT_URL = 'http://localhost:8000/api';

export async function editUser(dispatch, payload, token) {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        }
    };

    try {
        dispatch({ type: 'EDIT_USER_REQUEST' });
        let response = await fetch(`${ROOT_URL}/user`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'EDIT_USER_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'EDIT_USER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'EDIT_USER_ERROR', errorMessage: error })
    }
}

export async function changePassword(dispatch, payload, token) {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        },
        body:JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'CHANGE_PASSWORD_REQUEST' });
        let response = await fetch(`${ROOT_URL}/user/password`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CHANGE_PASSWORD_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'CHANGE_PASSWORD_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'CHANGE_PASSWORD_ERROR', errorMessage: error })
    }
}