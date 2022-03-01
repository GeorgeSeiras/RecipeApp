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