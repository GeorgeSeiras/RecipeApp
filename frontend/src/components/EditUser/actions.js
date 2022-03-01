const API_URL = process.env.REACT_APP_API_URL;

export async function editUser(dispatch, payload, token) {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        },
        body:JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'EDIT_USER_REQUEST' });
        let response = await fetch(`${API_URL}/user`, requestOptions);
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
        let response = await fetch(`${API_URL}/user/password`, requestOptions);
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

export async function changeImage(dispatch, payload, token) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
        body:payload
    };

    try {
        dispatch({ type: 'CHANGE_IMAGE_REQUEST' });
        let response = await fetch(`${API_URL}/image/user`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CHANGE_IMAGE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'CHANGE_IMAGE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'CHANGE_IMAGE_ERROR', errorMessage: error })
    }
}