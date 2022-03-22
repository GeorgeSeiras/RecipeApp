export const initialState = {
    images: null,
    recipe: null,
    errorMessage: null
}

export const CreateRecipeReducer = (initialState, action) => {

    switch (action.type) {
        case 'CREATE_RECIPE':
            return {
                ...initialState,
                recipe: action.payload
            };
        case 'UPLOAD_RECIPE_IMAGE':
            return {
                ...initialState,
                images: action.payload.images
            };
        case 'DELETE_RECIPE':
            return {
                ...initialState,
                recipe: null,
                images: null
            };
        case 'RECIPE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}