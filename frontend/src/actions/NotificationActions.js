const API_URL = process.env.REACT_APP_API_URL;

export async function setNotificationsAsRead(dispatch, payload, token, recipeId) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify(payload)
    };

    try {
        let response = await fetch(`${API_URL}/recipe/${recipeId}/rating`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'RATE_RECIPE', payload: data.result })
            return data
        }
        dispatch({ type: 'RATING_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RATING_ERROR', errorMessage: error })
    }
}

export async function getNotifications(dispatch, token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/notifications`, requestOptions);

        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_NOTIFICATIONS', payload: data })
            return data
        }
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'NOTIFICATIONS_ERROR', errorMessage: error })
    }
}