export const initialState = {
    images: null,
    recipe: null,
    errorMessage: null
}

export const RecipeReducer = (initialState, action) => {

    switch (action.type) {
        case 'CREATE_RECIPE':
            return {
                ...initialState,
                recipe: action.payload
            };
        case 'GET_RECIPE':
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
        case 'UPDATE_RECIPE_STATE':
            return {
                ...initialState,
                recipe: action.payload
            }
        case 'UPDATE_RECIPE':
            return {
                ...initialState,
                recipe: action.payload.recipe
            };
        case 'UPDATE_RATING_AVG_AND_VOTES':

            const votes = action.payload.hasRated ? initialState.recipe.votes : initialState.recipe.votes + 1
            const rating = parseFloat(action.payload.newRating)
            let newRating = null
            if (action.payload.hasRated) {
                newRating =
                    (votes * parseFloat(initialState.recipe.rating_avg) - parseFloat(action.payload.initRating) + rating) / votes
            } else {
                if (votes === 1) {
                    newRating = rating
                } else {
                    newRating = parseFloat(initialState.recipe.rating_avg) + (rating - parseFloat(initialState.recipe.rating_avg) / parseFloat(votes))
                }
            }
            return {
                ...initialState,
                recipe: {
                    ...initialState.recipe,
                    rating_avg: newRating,
                    votes: votes
                }
            }
        case 'DELETE_RECIPE_IMAGES':
            return {
                ...initialState,
                images: action.payload.images
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

export const initialStateRecipes = {
    recipes: null,
    loading: false,
    errorMessage: null
}

export const RecipesReducer = (initialStateRecipes, action) => {

    switch (action.type) {
        case 'GET_RECIPES':
            return {
                ...initialStateRecipes,
                recipes: action.payload
            };
        case 'GET_RECIPES_ERROR':
            return {
                ...initialStateRecipes,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

