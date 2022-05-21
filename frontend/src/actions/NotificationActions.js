const API_URL = process.env.REACT_APP_API_URL;

export async function setNotificationsAsRead(dispatch, token,) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/notifications`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'SET_AS_READ', payload: data.result })
            return data
        }
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: error })
    }
}

export async function getNotifications(dispatch, pageClicked, token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/notifications?page=${pageClicked}`, requestOptions);
        const data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_NOTIFICATIONS', payload: data })
            return data
        }
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: error })
    }
}

export function setSocket(dispatch, socket) {
    dispatch({ type: 'SET_SOCKET', payload: socket })
}

export function pushNotification(dispatch, notification) {
    dispatch({ type: 'PUSH_NOTIFICATION', payload: notification })
}