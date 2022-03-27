export const initialState = {
    recipes: null,
    errorMessage: null
}

export const RecipesInListReducer = (initialState, action) => {
    switch (action.type) {
        case 'DELETE_RECIPE_FROM_LIST':
            return {
                ...initialState,
                recipes: initialState?.recipes.filter(recipe => {
                    return recipe.id !== action.payload
                })
            };
        case 'GET_LIST_RECIPES':
            return {
                ...initialState,
                recipes: action.payload.map(item => {
                    return item.recipe
                })
            };
        case 'UPDATE_LIST_RECIPES':
            return{
                ...initialState,
                recipes: action.payload.map(item=>{
                    return item.recipe
                })
            }
        case 'RECIPES_LIST_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
