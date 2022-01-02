export const initialStateLogin = {
    token: null,
    loading: false,
    errorMessage: null
}

export const AuthReducer = (initialStateLogin, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialStateLogin,
                loading: true
            };
        case "LOGIN":
            return {
                ...initialStateLogin,
                token: action.payload.token,
                loading: false
            }
        case "LOGOUT":
            return {
                ...initialStateLogin,
                token: null
            }
        case "LOGIN_ERROR":
            return {
                ...initialStateLogin,
                loading: false,
                errorMessage: action.error
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateGetMe = {
    user: null,
    loading: false,
    errorMessage: null
}

export const GetMeReducer = (initialStateGetMe, action) => {
    switch (action.type) {
        case 'GET_ME_REQUEST':
            return {
                ...initialStateGetMe,
                loading: true
            };
        case 'GET_ME_SUCCESS':
            return {
                ...initialStateGetMe,
                user: action.payload.user
            }
        case 'GET_ME_ERROR':
            return {
                ...initialStateGetMe,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type :${action.type}`)
    }
}