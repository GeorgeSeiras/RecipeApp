const API_URL = process.env.REACT_APP_API_URL;

export async function getUserLists(dispatch, userId) {

    const requestOptions = {
        method: 'GET'
    };

    try {
        let response = await fetch(`${API_URL}/user/${userId}/list`, requestOptions);
        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_USER_LISTS', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: error })
    }
}

export async function getListRecipes(dispatch, id, queryParams, pageClicked) {

    const requestOptions = {
        method: 'GET',
    };

    try {
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
        const response = await fetch(`${API_URL}/list`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_LIST', payload: data.result })
            return data
        }
        dispatch({ type: 'LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'LIST_ERROR', errorMessage: error })
    }
}

export async function getList(dispatch, listId) {

    const requestOptions = {
        method: 'GET',
    };

    try {
        const response = await fetch(`${API_URL}/list/${listId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_LIST', payload: data.result })
            return data
        }
        dispatch({ type: 'LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'LIST_ERROR', errorMessage: error })
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
        const response = await fetch(`${API_URL}/list/${listId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'DELETE_LIST', payload: data.result })
            return data
        }
        dispatch({ type: 'LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'LIST_ERROR', errorMessage: error })
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
        const response = await fetch(`${API_URL}/list/${listId}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'DELETE_RECIPE_FROM_LIST', payload: recipeId })
            return data
        }
        dispatch({ type: 'LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'LIST_ERROR', errorMessage: error })
    }
}