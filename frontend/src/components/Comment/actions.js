const API_URL = process.env.REACT_APP_API_URL

export async function getRecipeComments(dispatch, id) {
    const requestOptions = {
        method: 'GET',
    };

    try {
        dispatch({ type: 'COMMENTS_REQUEST' });
        let response = await fetch(`${API_URL}/recipe/${id}/comments`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'COMMENTS_SUCCESS', payload: data })
            return data
        }
        dispatch({ type: 'COMMENTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENTS_ERROR', errorMessage: error })
    }
}

export async function loadMoreComments(dispatch, next) {
    const requestOptions = {
        method: 'GET'
    }

    try {
        dispatch({ type: 'COMMENTS_REQUEST' });
        let response = await fetch(`${next}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'COMMENTS_SUCCESS', payload: data })
            return data
        }
        dispatch({ type: 'COMMENTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENTS_ERROR', errorMessage: error })
    }
}

export async function postComment(dispatch, payload, token, recipeId) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }

    try {
        dispatch({ type: 'CREATE_COMMENT_REQUEST' });
        let response = await fetch(`${API_URL}/recipe/${recipeId}/comment`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_COMMENT_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'CREATE_COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'CREATE_COMMENT_ERROR', errorMessage: error })
    }
}

export async function deleteComment(dispatch, token, commentId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }

    try {
        dispatch({ type: 'DELETE_COMMENT_REQUEST' });
        let response = await fetch(`${API_URL}/comment/${commentId}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_COMMENT_SUCCESS', payload: data.result })
            return data
        }
        dispatch({ type: 'DELETE_COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'DELETE_COMMENT_ERROR', errorMessage: error })
    }
}