export const initialState = {
    user: null,
    errorMessage: null
}

export const UserReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_USER':
            return {
                ...initialState,
                user: action.payload
            };
        case 'EDIT_USER':
            return {
                ...initialState,
                user: action.payload
            };
        case 'CHANGE_IMAGE':
            return {
                ...initialState,
                user: action.payload
            };
        case 'CHANGE_PASSWORD':
            return {
                ...initialState,
                user: action.payload
            };
        case 'DISSMISS_ERROR':
            return {
                ...initialState,
                errorMessage: null
            }
        case 'USER_ERROR':
            return {
                ...initialState,
                errorMessage: initialState?.errorMessage ?
                    [...initialState.errorMessage, action.errorMessage] :
                    [action.errorMessage]
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}