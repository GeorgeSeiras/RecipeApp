import Cookies from 'universal-cookie';

const API_URL = process.env.REACT_APP_API_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_ADDRESS;

export async function sociallogin(dispatch,provider, accessToken) {
    const cookies = new Cookies();
    const payload = {
        token: accessToken,
        backend: provider,
        grant_type: 'convert_token',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET
    }
    var formBody = [];
    for (var property in payload) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(payload[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody
    }
    try {
        const response = await fetch(`http://${BACKEND_URL}/auth/convert-token`, requestOptions);
        const data = await response.json();
        if (data?.access_token) {
            dispatch({ type: 'LOGIN', payload: data.access_token })
            const date = new Date();
            const expires = new Date(date.setDate(date.getDate() + 30));
            cookies.set('token',
                { key: data.access_token },
                {
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',
                    expires: expires
                });
            return data.access_token;
        }
        dispatch({ type: 'LOGIN_ERROR', error: data.detail })
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error });
    }
}

export async function userLogin(dispatch, payload, remember) {
    const cookies = new Cookies();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`http://${BACKEND_URL}/auth/token`, requestOptions);
        const data = await response.json();
        if (data?.access_token) {
            dispatch({ type: 'LOGIN', payload: data.access_token })
            var expires = null;
            if (remember) {
                const date = new Date();
                expires = new Date(date.setDate(date.getDate() + 30));
            }
            cookies.set('token',
                { key: data.access_token },
                {
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',
                    expires: expires
                });
            return data
        }
        dispatch({ type: 'LOGIN_ERROR', error: data.error_description })
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