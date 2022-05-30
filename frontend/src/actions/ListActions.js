const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

export async function getUserLists(dispatch, userId) {

    const requestOptions = {
        method: 'GET'
    };

    try {
        let response = await fetch(`${API_URL}/user/${userId}/list`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'GET_USER_LISTS', payload: data })
            return data
        }
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: error })
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

export async function getList(dispatch, listId, token) {
    var requestOptions = {};
    if (token) {
        requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '.concat(token),
            }
        }
    }else{
        requestOptions={
            method:'GET'
        }
    }

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

export async function getListsWithRecipe(dispatch, token, recipeId) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/lists/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_LISTS_WITH_RECIPE', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: error })
    }
}

export async function addRecipeToList(dispatch, token, listId, recipeId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/list/${listId}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'ADD_RECIPE_TO_LIST', payload: data.result })
            return data
        }
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'USER_LISTS_ERROR', errorMessage: error })
    }
}