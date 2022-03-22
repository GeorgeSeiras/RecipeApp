export const initialState = {
    user: null,
    errorMessage: null
}

export const EditUserReducer = (initialState, action) => {
    switch (action.type) {
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
        case 'EDIT_USER_ERROR':
            return {
                ...initialState,
                errorMessage: initialState?.errorMessage?
                    [...initialState.errorMessage,action.errorMessage]:
                    [action.errorMessage]
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}