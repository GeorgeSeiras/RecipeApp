const API_URL = process.env.REACT_APP_API_URL

export async function getFolders(dispatch, parent, token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    };

    try {
        let query = ``
        if (parent !== null && parent !== undefined) {
            query = query.concat(`?parent=${parent}`)
        }
        const response = await fetch(`${API_URL}/folder${query}`, requestOptions);
        const data = await response.json();
        if (data) {
            dispatch({ type: 'GET_FOLDERS', payload: data })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export async function createFolder(dispatch, payload, token) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }

    try {
        const response = await fetch(`${API_URL}/folder`, requestOptions);
        const data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_FOLDER', payload: data.result })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export async function deleteFolder(dispatch, token, folderId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }
    try {
        let response = await fetch(`${API_URL}/folder/${folderId}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_FOLDER', payload: data.result })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export async function getMedia(dispatch, folderId, limit, offset, token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    };

    try {
        let query = `?folder=${folderId}&offset=${offset}`
        if (limit !== null) {
            query = query.concat(`&limit=${limit}`)
        }

        const response = await fetch(`${API_URL}/folder/media${query}`, requestOptions);
        const data = await response.json();
        if (data) {
            dispatch({ type: 'GET_MEDIA', payload: data })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export async function createMedia(dispatch, payload, token) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }

    try {
        let response = await fetch(`${API_URL}/media`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'CREATE_MEDIA', payload: data.result })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export async function deleteMedia(dispatch, token, mediaId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token),
        }
    }
    try {
        let response = await fetch(`${API_URL}/media/${mediaId}`, requestOptions);
        let data = await response.json();
        if (data) {
            dispatch({ type: 'DELETE_MEDIA', payload: data.result })
            return data
        }
        dispatch({ type: 'MEDIA_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'MEDIA_ERROR', errorMessage: error })
    }
}

export function updateDepth(dispatch, depth) {
    dispatch({ type: 'UPDATE_DEPTH', payload: depth })
}

export function setCurFolder(dispatch, folder) {
    dispatch({ type: 'SET_CURFOLDER', payload: folder })
}