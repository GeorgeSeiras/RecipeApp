export const initialStateLogin = {
    token: null,
    loading: false,
    errorMessage: null
}

export const AuthReducer = (initialStateLogin, action) => {
    switch (action.type) {
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
        case 'GET_ME':
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

export const initialStateReset = {
    errorMessage: null
}

export const passwordResetReducer = (initialStateReset,action)=>{
    switch (action.type) {
        case 'RESET_REQUEST':
            return {
                ...initialStateReset,
            }
        case 'RESET_SUCCESS':
                return {
                    ...initialStateReset,
                }
        case 'RESET_ERROR':
            return {
                ...initialStateReset,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type :${action.type}`)
    }
}