export const initialState = {
    user: null,
    loading: false,
    errorMessage: null
}

export const SignupReducer = (initialState, action) => {
    
    switch (action.type) {
        case 'REGISTER_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'REGISTER_SUCCESS':
            return {
                ...initialState,
                user: action.payload.user
            };
        case 'REGISTER_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

