const ROOT_URL = 'http://localhost:8000/api';

export async function getRecipes(dispatch, queryParams) {

    let payload = {}
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        dispatch({ type: 'GET_RECIPES_REQUEST' });
        let response = null
        console.log(queryParams)
        if (!queryParams) {
            response = await fetch(`${ROOT_URL}/recipes`, requestOptions);
        } else {
            response = await fetch(`${ROOT_URL}/recipes${queryParams}`, requestOptions);
        }
        let data = await response.json();
        if (data) {
            dispatch({ type: 'GET_RECIPES_SUCCESS', payload: data })
            return data
        }
        dispatch({ type: 'GET_RECIPES_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'GET_RECIPES_ERROR', errorMessage: error })
    }
}