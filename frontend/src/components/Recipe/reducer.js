export const initialState = {
    recipe: null,
    loading: false,
    errorMessage: null
}

export const RecipeReducer = (initialState, action) => {
    
    switch (action.type) {
        case 'RECIPE_REQUEST':
            return {
                ...initialStateRating,
                loading: true
            };
        case 'RECIPE_SUCCESS':
            return {
                ...initialStateRating,
                recipe: action.payload.recipe
            };
        case 'RECIPE_ERROR':
            return {
                ...initialStateRating,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateRating = {
    rating: null,
    loading: false,
    errorMessage: null
}

export const RateRecipeReducer = (initialStateRating, action) => {
    
    switch (action.type) {
        case 'RATE_RECIPE_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'RATE_RECIPE_SUCCESS':
            return {
                ...initialState,
                recipe: action.payload.recipe
            };
        case 'RATE_RECIPE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

