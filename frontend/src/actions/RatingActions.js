const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

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

export async function getUserRecipeRating(dispatch, token, recipeId) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        let response = await fetch(`${API_URL}/recipe/${recipeId}/rating`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_USER_RECIPE_RATING', payload: data.result })
            return data
        }
        dispatch({ type: 'RATING_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RATING_ERROR', errorMessage: error })
    }
}

export function updateRatingAndVotes(dispatch, payload) {
    dispatch({ type: 'UPDATE_RATING_AVG_AND_VOTES', payload })
}