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
                recipe: action.payload
            };
        case 'RECIPE_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        case 'UPDATE_RECIPE_STATE':
            return {
                ...initialState,
                recipe: action.payload
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
                ...initialStateRating,
                loading: true
            };
        case 'RATE_RECIPE_SUCCESS':
            return {
                ...initialStateRating,
                recipe: action.payload.recipe
            };
        case 'RATE_RECIPE_ERROR':
            return {
                ...initialStateRating,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const UserRecipeRatingReducer = (initialStateRating, action) => {

    switch (action.type) {
        case 'GET_USER_RECIPE_RATING_REQUEST':
            return {
                ...initialStateRating,
                loading: true
            };
        case 'GET_USER_RECIPE_RATING_SUCCESS':
            return {
                ...initialStateRating,
                rating: action.payload
            };
        case 'GET_USER_RECIPE_RATING_ERROR':
            return {
                ...initialStateRating,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateLists = {
    lists: null,
    loading: false,
    errorMessage: null
}

export const ListsWithRecipeReducer = (initialStateLists, action) => {

    switch (action.type) {
        case 'GET_LISTS_WITH_RECIPE_REQUEST':
            return {
                ...initialStateLists,
                loading: true
            };
        case 'GET_LISTS_WITH_RECIPE_SUCCESS':
            return {
                ...initialStateLists,
                lists: action.payload.lists
            };
        case 'GET_LISTS_WITH_RECIPE_ERROR':
            return {
                ...initialStateLists,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateAddRecipeToList = {
    recipeInList: null,
    loading: false,
    errorMessage: null
}

export const addRecipeToListReducer = (initialStateAddRecipeToList, action) => {

    switch (action.type) {
        case 'ADD_RECIPE_TO_LIST_REQUEST':
            return {
                ...initialStateAddRecipeToList,
                loading: true
            };
        case 'ADD_RECIPE_TO_LIST_SUCCESS':
            return {
                ...initialStateAddRecipeToList,
                recipeInList: action.payload.result
            };
        case 'ADD_RECIPE_TO_LIST_ERROR':
            return {
                ...initialStateAddRecipeToList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateRecipe = {
    recipe: null,
    loading: false,
    errorMessage: null
}

export const UpdateRecipeReducer = (initialStateRecipe, action) => {

    switch (action.type) {
        case 'UPDATE_RECIPE_REQUEST':
            return {
                ...initialStateRecipe,
                loading: true
            };
        case 'UPDATE_RECIPE_SUCCESS':
            return {
                ...initialStateRecipe,
                recipe: action.payload.recipe
            };
        case 'UPDATE_RECIPE_ERROR':
            return {
                ...initialStateRecipe,
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

export const DeleteRecipeImagesReducer = (initialStateImages, action) => {

    switch (action.type) {
        case 'DELETE_RECIPE_IMAGES_REQUEST':
            return {
                ...initialStateImages,
                loading: true
            };
        case 'DELETE_RECIPE_IMAGES_SUCCESS':
            return {
                ...initialStateImages,
                images: action.payload.images
            };
        case 'DELETE_RECIPE_IMAGES_ERROR':
            return {
                ...initialStateImages,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}