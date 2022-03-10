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

export async function getListRecipes(dispatch, id, token, queryParams, pageClicked) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
    };

    try {
        dispatch({ type: 'GET_LIST_RECIPES_REQUEST' });
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
            dispatch({ type: 'GET_LIST_RECIPES_SUCCESS', payload: data.results })
            return data
        }
        dispatch({ type: 'GET_LIST_RECIPES_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_LIST_RECIPES_ERROR', errorMessage: error })
    }
}

export async function createList(dispatch, token, payload) {

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '.concat(token),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'CREATE_LIST_REQUEST' });
        const response = await fetch(`${API_URL}/list`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'CREATE_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'CREATE_LIST_ERROR', errorMessage: error })
    }
}

export async function getList(dispatch, listId) {

    const requestOptions = {
        method: 'GET',
    };

    try {
        dispatch({ type: 'GET_LIST_REQUEST' });
        const response = await fetch(`${API_URL}/list/${listId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_LIST_ERROR', errorMessage: error })
    }
}

export async function deleteList(dispatch, listId, token) {

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        }
    };

    try {
        dispatch({ type: 'DELETE_LIST_REQUEST' });
        const response = await fetch(`${API_URL}/list/${listId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'DELETE_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'DELETE_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'DELETE_LIST_ERROR', errorMessage: error })
    }
}

export async function deleteRecipeFromList(dispatch, listId, recipeId,token) {

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        }
    };

    try {
        dispatch({ type: 'DELETE_RECIPE_FROM_LIST_REQUEST' });
        const response = await fetch(`${API_URL}/list/${listId}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'DELETE_RECIPE_FROM_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'DELETE_RECIPE_FROM_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'DELETE_RECIPE_FROM_LIST_ERROR', errorMessage: error })
    }
}