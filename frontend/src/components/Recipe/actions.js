const API_URL = process.env.REACT_APP_API_URL;

export async function getRecipe(dispatch, payload) {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        dispatch({ type: 'RECIPE_REQUEST' });
        let response = await fetch(`${API_URL}/recipe/${payload.recipe}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'RECIPE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
}

export async function rateRecipe(dispatch, payload, token, recipeId) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'RATE_RECIPE_REQUEST' });
        let response = await fetch(`${API_URL}/recipe/${recipeId}/rating`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'RATE_RECIPE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'RATE_RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RATE_RECIPE_ERROR', errorMessage: error })
    }
}

export async function getUserRecipeRating(dispatch, token, recipeId) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        dispatch({ type: 'GET_USER_RECIPE_RATING_REQUEST' });
        let response = await fetch(`${API_URL}/recipe/${recipeId}/rating`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_USER_RECIPE_RATING_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_USER_RECIPE_RATING_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_USER_RECIPE_RATING_ERROR', errorMessage: error })
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
        dispatch({ type: 'GET_LISTS_WITH_RECIPE_REQUEST' });
        const response = await fetch(`${API_URL}/lists/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_LISTS_WITH_RECIPE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'GET_LISTS_WITH_RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_LISTS_WITH_RECIPE_ERROR', errorMessage: error })
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
        dispatch({ type: 'ADD_RECIPE_TO_LIST_REQUEST' });
        const response = await fetch(`${API_URL}/list/${listId}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'ADD_RECIPE_TO_LIST_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'ADD_RECIPE_TO_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'ADD_RECIPE_TO_LIST_ERROR', errorMessage: error })
    }
}

export async function updateRecipe(dispatch, payload, token,recipeId) {

    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        dispatch({ type: 'UPDATE_RECIPE_REQUEST' });
        const response = await fetch(`${API_URL}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'UPDATE_RECIPE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'UPDATE_RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'UPDATE_RECIPE_ERROR', errorMessage: error })
    }
}

export function updateRecipeState(dispatch,recipe){
        dispatch({type:'UPDATE_RECIPE_STATE',payload:recipe})
}

export async function deleteRecipeImages(dispatch, payload, token, recipeId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(`${API_URL}/recipe/${recipeId}/images`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'DELETE_RECIPE_IMAGES_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'DELETE_RECIPE_IMAGES_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'DELETE_RECIPE_IMAGES_ERROR', errorMessage: error })
    }
}