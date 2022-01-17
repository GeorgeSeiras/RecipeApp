export const initialState = {
    recipe: null,
    loading: false,
    errorMessage: null
}

export const RecipeReducer = (initialState, action) => {
    
    switch (action.type) {
        case 'RECIPE_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'RECIPE_SUCCESS':
            return {
                ...initialState,
                recipe: action.payload.recipe
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

