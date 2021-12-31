import Cookies from "universal-cookie";

const cookies = new Cookies();

let token = cookies.get('token')
    ? cookies.get('token')
    : null;

export const initialState = {
    token: null || token,
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