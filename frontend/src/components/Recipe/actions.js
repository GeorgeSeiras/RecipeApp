const ROOT_URL = 'http://localhost:8000/api';

export async function getRecipe(dispatch, payload) {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        dispatch({ type: 'RECIPE_REQUEST' });
        let response = await fetch(`${ROOT_URL}/recipe/${payload.recipe}`, requestOptions);
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
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify(payload)
    };

    try {
        dispatch({ type: 'RATE_RECIPE_REQUEST' });
        let response = await fetch(`${ROOT_URL}/recipe/${recipeId}/rating`, requestOptions);
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