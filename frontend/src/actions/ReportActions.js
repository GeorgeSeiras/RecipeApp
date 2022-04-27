const API_URL = process.env.REACT_APP_API_URL;

export async function getReports(dispatch, status, pageClicked, token) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
    };
    try {
        let response = null
        let queryParams = status ? `?status=${status}` : ``
        if (pageClicked) {
            if (status) {
                queryParams.concat(`?page=${pageClicked}`);
            } else {
                queryParams.concat(`&page=${pageClicked}`);
            }
        }
        response = await fetch(`${API_URL}/reports${queryParams}`, requestOptions);
        
        let data = await response.json();
        if (data?.results) {
            dispatch({ type: 'GET_REPORTS', payload: data })
            return data
        }
        dispatch({ type: 'REPORTS_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'REPORTS_ERROR', errorMessage: error })
    }
}

export async function getReport(dispatch, id, token) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '.concat(token)
        },
    };
    try {
        let response = await fetch(`${API_URL}/report/${id}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'GET_REPORT', payload: data.result })
            return data
        }
        dispatch({ type: 'REPORT_ERROR', errorMessage: data })
    } catch (error) {
        dispatch({ type: 'REPORT_ERROR', errorMessage: error })
    }
}

export async function updateReport(dispatch, payload, id, token) {

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(token)
        },
        body: JSON.stringify(payload)
    };

    try {
        let response = await fetch(`${API_URL}/report/${id}`, requestOptions);
        let data = await response.json();
        if (data?.result) {
            dispatch({ type: 'UPDATE_REPORT', payload: data.result })
            return data
        }
        dispatch({ type: 'REPORT_ERROR', errorMessage: data?.message })
    } catch (error) {
        dispatch({ type: 'REPORT_ERROR', errorMessage: error })
    }
}

