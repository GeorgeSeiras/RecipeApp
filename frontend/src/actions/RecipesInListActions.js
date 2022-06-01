const API_URL = process.env.REACT_APP_BACKEND_URL+'/api'

export async function getListRecipes(dispatch, id, queryParams, setSearchParams) {

    const requestOptions = {
        method: 'GET',
    };

    try {
        const response = await fetch(`${API_URL}/list/${id}/recipes${queryParams}`, requestOptions);
        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_LIST_RECIPES', payload: data.results })
            setSearchParams(queryParams)
            return data
        }
        dispatch({ type: 'RECIPES_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPES_LIST_ERROR', errorMessage: error })
    }
}

export async function deleteRecipeFromList(dispatch, listId, recipeId, token) {

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
        dispatch({ type: 'RECIPES_LIST_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'RECIPES_LIST_ERROR', errorMessage: error })
    }
}

export function updateRecipesInList(dispatch, payload) {
    dispatch({ type: 'UPDATE_LIST_RECIPES', payload: payload });
}