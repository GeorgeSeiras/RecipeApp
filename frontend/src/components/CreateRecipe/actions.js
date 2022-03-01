const API_URL = process.env.REACT_APP_API_URL;

export async function createRecipe(dispatch, payload, token) {

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        dispatch({ type: 'CREATE_RECIPE_REQUEST' });
        const response = await fetch(`${API_URL}/recipe`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_RECIPE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'CREATE_RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'CREATE_RECIPE_ERROR', errorMessage: error })
    }
}

export async function uploadRecipeImages(dispatch, payload, token, recipeId) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
        body: payload
    }

    try {
        const response = await fetch(`${API_URL}/recipe/${recipeId}/image`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'UPLOAD_RECIPE_IMAGE_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'UPLOAD_RECIPE_IMAGE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'UPLOAD_RECIPE_IMAGE_ERROR', errorMessage: error })
    }
}

export async function deleteRecipe(dispatch, recipeId, token) {

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        dispatch({ type: 'DELETE_RECIPE_REQUEST' });
        const response = await fetch(`${API_URL}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_RECIPE_SUCCESS', payload: data })
            return data
        }
        dispatch({ type: 'DELETE_RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'DELETE_RECIPE_ERROR', errorMessage: error })
    }
}