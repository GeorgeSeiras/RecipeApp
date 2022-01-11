export const initialState = {
    user: null,
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
                user: action.payload.user
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

