const API_URL = process.env.REACT_APP_API_URL;

export async function getUserLists(dispatch, userId) {

    const requestOptions = {
        method: 'GET'
    };

    try {
        dispatch({ type: 'GET_USER_LISTS_REQUEST' });
        let response = await fetch(`${API_URL}/user/${userId}/list`, requestOptions);
        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_USER_LISTS_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_USER_LISTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_USER_LISTS_ERROR', errorMessage: error })
    }
}

export async function getList(dispatch, id, token, queryParams, pageClicked) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
    };

    try {
        dispatch({ type: 'GET_LIST_REQUEST' });
        var response = null;
        if (pageClicked) {
            if (queryParams === '') {
                queryParams = `?page=${pageClicked}`;
            } else {
                queryParams.concat(`&page=${pageClicked}`);
            }
            response = await fetch(`${API_URL}/list/${id}/recipes${queryParams}`, requestOptions);
        } else {
            response = await fetch(`${API_URL}/list/${id}/recipes${queryParams}`, requestOptions);
        }
        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_LIST_ERROR', errorMessage: error })
    }
}