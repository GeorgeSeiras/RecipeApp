export const initialStateEditUser = {
    user: null,
    loading: false,
    errorMessage: null
}

export const EditUserReducer = (initialStateEditUser, action) => {
    
    switch (action.type) {
        case 'EDIT_USER_REQUEST':
            return {
                ...initialStateEditUser,
                loading: true
            };
        case 'EDIT_USER_SUCCESS':
            return {
                ...initialStateEditUser,
                user: action.payload.user
            };
        case 'EDIT_USER_ERROR':
            return {
                ...initialStateEditUser,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStatePassword = {
    user: null,
    loading: false,
    errorMessage: null
}

export const ChangePasswordReducer = (initialStatePassword, action) => {
    
    switch (action.type) {
        case 'CHANGE_PASSWORD_REQUEST':
            return {
                ...initialStatePassword,
                loading: true
            };
        case 'CHANGE_PASSWORD_SUCCESS':
            return {
                ...initialStatePassword,
                user: action.payload.user
            };
        case 'CHANGE_PASSWORD_ERROR':
            return {
                ...initialStatePassword,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateImage = {
    user: null,
    loading: false,
    errorMessage: null
}

export const ChangeImageReducer = (initialStateImage, action) => {
    
    switch (action.type) {
        case 'CHANGE_IMAGE_REQUEST':
            return {
                ...initialStateImage,
                loading: true
            };
        case 'CHANGE_IMAGE_SUCCESS':
            return {
                ...initialStateImage,
                user: action.payload.user
            };
        case 'CHANGE_IMAGE_ERROR':
            return {
                ...initialStateImage,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}