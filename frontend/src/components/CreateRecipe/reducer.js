export const initialState = {
    recipe: null,
    loading: false,
    errorMessage: null
}

export const CreateRecipeReducer = (initialState, action) => {

    switch (action.type) {
        case 'CREATE_RECIPE_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'CREATE_RECIPE_SUCCESS':
            return {
                ...initialState,
                recipe: action.payload.recipe
            };
        case 'CREATE_RECIPE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateImages = {
    images: null,
    loading: false,
    errorMessage: null
}

export const UploadImageReducer = (initialState, action) => {

    switch (action.type) {
        case 'UPLOAD_RECIPE_IMAGE_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'UPLOAD_RECIPE_IMAGE_SUCCESS':
            return {
                ...initialState,
                images: action.payload.images
            };
        case 'UPLOAD_RECIPE_IMAGE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateDelete = {
    recipe: null,
    loading: false,
    errorMessage: null
}

export const DeleteRecipeReducer = (initialState, action) => {

    switch (action.type) {
        case 'DELETE_RECIPE_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'DELETE_RECIPE_SUCCESS':
            return {
                ...initialState,
                recipe: action.payload.recipe
            };
        case 'DELETE_RECIPE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}