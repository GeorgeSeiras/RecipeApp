export const initialState = {
    errorMessage: null,
    success: null
}

export const VerificationReducer = (initialState, action) => {
    switch (action.type) {
        case 'VERIFY_TOKEN':
            return {
                ...initialState,
                success: action.payload
            };
        case 'NEW_TOKEN':
            return {
                ...initialState,
                success: action.payload
            };
        case 'TOKEN_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}