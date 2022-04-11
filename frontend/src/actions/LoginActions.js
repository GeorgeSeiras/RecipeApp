import Cookies from 'universal-cookie';

const API_URL = process.env.REACT_APP_API_URL;

export async function userLogin(dispatch, payload, remember) {
    const cookies = new Cookies();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`${API_URL}/token/`, requestOptions);
        const data = await response.json();
        if (data?.access) {
            dispatch({ type: 'LOGIN', payload: data.access })
            var expires = null;
            if (remember) {
                const date = new Date();
                expires = new Date(date.setDate(date.getDate() + 30));
            }

            cookies.set('token',
                { key: data.access },
                {
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',
                    expires: expires
                });
            return data
        }
        dispatch({ type: 'LOGIN_ERROR', error: data.detail })
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error });
    }
}

export async function getMe(dispatch, token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        }
    };
    try {
        const response = await fetch(`${API_URL}/user/me`, requestOptions);
        const data = await response.json();
        if (data?.user) {
            dispatch({ type: 'GET_ME', payload: data.user })
            return data
        }
        dispatch({ type: 'GET_ME_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_ME_ERROR', errorMessage: error })
    }
}