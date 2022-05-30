const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

export async function getRecipes(dispatch, queryParams, pageClicked) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        let response = null
        if (pageClicked) {
            if (queryParams === '') {
                queryParams = `?page=${pageClicked}`;
            } else {
                queryParams.concat(`&page=${pageClicked}`);
            }
            response = await fetch(`${API_URL}/recipes${queryParams}`, requestOptions);
        } else {
            response = await fetch(`${API_URL}/recipes${queryParams}`, requestOptions);
        }

        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_RECIPES', payload: data })
            return data
        }
        dispatch({ type: 'GET_RECIPES_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_RECIPES_ERROR', errorMessage: error })
    }
}

export async function incrementRecipeHits(dispatch, recipeId) {
    const requestOptions = {
        method: 'PATCH',
    };

    try {
        const response = await fetch(`${API_URL}/recipe/${recipeId}/hitcount`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'INCREMENT_RECIPE_HITS', payload: data.result })
            return data
        }
        if (data?.status_code !== 429) {
            dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
        }
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
}

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
        const response = await fetch(`${API_URL}/recipe`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_RECIPE', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
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
            dispatch({ type: 'UPLOAD_RECIPE_IMAGE', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
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
        const response = await fetch(`${API_URL}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_RECIPE', payload: data })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
}

export async function getRecipe(dispatch, payload, token) {

    var requestOptions = {}
    if (token) {
        requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(token)
            },
        }
    } else {
        requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }

    try {
        let response = await fetch(`${API_URL}/recipe/${payload.recipe}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_RECIPE', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
}

export async function updateRecipe(dispatch, payload, token, recipeId) {

    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        },
    };

    try {
        const response = await fetch(`${API_URL}/recipe/${recipeId}`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'UPDATE_RECIPE', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
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
            dispatch({ type: 'DELETE_RECIPE_IMAGES', payload: data.result })
            return data
        }
        dispatch({ type: 'RECIPE_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPE_ERROR', errorMessage: error })
    }
}

export function updateRecipeState(dispatch, recipe) {
    dispatch({ type: 'UPDATE_RECIPE_STATE', payload: recipe })
}

export function updateErrorMessage(dispatch, payload) {
    dispatch({ type: 'UPDATE_ERROR_MESSAGE', payload })
}