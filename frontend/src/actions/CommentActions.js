const API_URL = process.env.REACT_APP_API_URL

export async function getRecipeComments(dispatch, id) {
    const requestOptions = {
        method: 'GET',
    };

    try {
        let response = await fetch(`${API_URL}/recipe/${id}/comments`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'GET_COMMENTS', payload: data })
            return data
        }
        dispatch({ type: 'COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
    }
}

export async function loadMoreComments(dispatch, next) {
    const requestOptions = {
        method: 'GET'
    }

    try {
        let response = await fetch(`${next}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'LOAD_COMMENTS', payload: data })
            return data
        }
        dispatch({ type: 'COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
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
        let response = await fetch(`${API_URL}/recipe/${recipeId}/comment`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_COMMENT', payload: data.result })
            return data
        }
        dispatch({ type: 'COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
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
        let response = await fetch(`${API_URL}/comment/${commentId}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_COMMENT', payload: data.result })
            return data
        }
        dispatch({ type: 'COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
    }
}

export function replaceComments(dispatch, comments) {
    try {
        dispatch({ type: 'REPLACE_COMMENTS', payload: comments })
        return true;
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
    }
}

export async function getContinueThreadComments(dispatch, id) {
    const requestOptions = {
        method: 'GET',
    };

    try {
        let response = await fetch(`${API_URL}/comments/${id}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'GET_CONTINUE_THREAD_COMMENTS', payload: data })
            return data
        }
        dispatch({ type: 'COMMENT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'COMMENT_ERROR', errorMessage: error })
    }
}