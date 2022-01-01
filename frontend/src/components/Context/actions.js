import Cookies from 'universal-cookie';

const ROOT_URL = 'http://localhost:8000/api';

export async function login(dispatch, payload) {
    const cookies = new Cookies();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'REQUEST_LOGIN' });
        let response = await fetch(`${ROOT_URL}/token/`, requestOptions);
        let data = await response.json();
        if (data.access) {
            dispatch({ type: 'LOGIN', payload: data.access })
            var date = new Date()
            cookies.set('token',
                { key: data.access },
                {
                    path: '/',
                    httpOnly: false,
                    expires: new Date(date.setDate(date.getDate() + 30)),
                    sameSite: 'lax',
                });
            return data
        }
        dispatch({ type: 'LOGIN_ERROR', error: data.detail })
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error });
    }
}