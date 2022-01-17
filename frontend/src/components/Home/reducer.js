export const initialState = {
    recipes: null,
    loading: false,
    errorMessage: null
}

export const RecipesReducer = (initialState, action) => {

    switch (action.type) {
        case 'GET_RECIPES_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'GET_RECIPES_SUCCESS':
            return {
                ...initialState,
                recipes: action.payload
            };
        case 'GET_RECIPES_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

