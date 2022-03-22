export const initialState = {
    user: null,
    loading: false,
    errorMessage: null
}

export const GetUserReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_USER_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'GET_USER_SUCCESS':
            return {
                ...initialState,
                user: action.payload
            };
        case 'GET_USER_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}