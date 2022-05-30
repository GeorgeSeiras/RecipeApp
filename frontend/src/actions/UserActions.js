const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

export async function getUser(dispatch, username, token) {
    var requestOptions = {}
    if (token) {
        requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '.concat(token)
            },
        };
    } else {
        requestOptions = {
            method: 'GET'
        }
    }


    try {
        let response = await fetch(`${API_URL}/user/${username}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_USER', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_ERROR', errorMessage: error })
    }
}

export async function editUser(dispatch, payload, token) {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        },
        body: JSON.stringify(payload)
    };

    try {
        let response = await fetch(`${API_URL}/user/me`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'EDIT_USER', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_ERROR', errorMessage: data?.message })
    } catch (error) {
        dispatch({ type: 'USER_ERROR', errorMessage: error })
    }
}

export async function changePassword(dispatch, payload, token) {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        },
        body: JSON.stringify(payload)
    };

    try {
        let response = await fetch(`${API_URL}/user/password`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CHANGE_PASSWORD', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_ERROR', errorMessage: error })
    }
}

export async function changeImage(dispatch, payload, token) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
        body: payload
    };
    try {
        let response = await fetch(`${API_URL}/image/user`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CHANGE_IMAGE', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_ERROR', errorMessage: data.image[0] })
    } catch (error) {
        dispatch({ type: 'USER_ERROR', errorMessage: error })
    }
}

export function dissmissError(dispatch) {
    dispatch({ type: 'DISSMISS_ERROR' })
}