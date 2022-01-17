export const initialState = {
    user: null,
    loading: false,
    errorMessage: null
}

export const UserReducer = (initialState, action) => {
    
    switch (action.type) {
        case 'User_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'User_SUCCESS':
            return {
                ...initialState,
                user: action.payload.user
            };
        case 'USER_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

