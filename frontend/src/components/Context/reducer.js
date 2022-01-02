export const initialState = {
    user: null,
    loading: false,
    errorMessage: null
}

export const GetMeReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_ME_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'GET_ME_SUCCESS':
            return {
                ...initialState,
                user: action.payload.user
            }
        case 'GET_ME_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type :${action.type}`)
    }
}