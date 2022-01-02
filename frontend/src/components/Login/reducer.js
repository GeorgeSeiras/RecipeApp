export const initialState = {
    token: null ,
    loading: false,
    errorMessage: null
}

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true
            };
        case "LOGIN":
            return {
                ...initialState,
                token: action.payload.token,
                loading: false
            }
        case "LOGOUT":
            return {
                ...initialState,
                token: null
            }
        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}