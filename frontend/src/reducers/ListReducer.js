export const initialStateUserLists = {
    lists: null,
    loading: false,
    errorMessage: null
}

export const GetUserListsReducer = (initialStateUserLists, action) => {
    switch (action.type) {
        case 'CREATE_LIST':
            return {
                ...initialStateUserLists,
                list: [action.payload?.result, initialStateUserLists.list]
            };
        case 'GET_USER_LISTS':
            return {
                ...initialStateUserLists,
                lists: action.payload?.lists
            };
        case 'USER_LISTS_ERROR':
            return {
                ...initialStateUserLists,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateList = {
    recipes: null,
    list: null,
    errorMessage: null
}

export const ListReducer = (initialStateList, action) => {
    switch (action.type) {
        case 'GET_LIST':
            return {
                ...initialStateList,
                list: action.payload?.result
            };
        case 'DELETE_LIST':
            return {
                ...initialStateList,
                result: action.payload?.result
            };
        case 'DELETE_RECIPE_FROM_LIST':
            return {
                ...initialStateList,
                recipes: initialStateList?.recipes.filter(recipe => {
                    if (recipe.id !== action.payload) {
                        return recipe
                    }
                })
            };
        case 'GET_LIST_RECIPES_SUCCESS':
            return {
                ...initialStateList,
                recipes: action.payload.map(item => {
                    return item.recipe
                })
            };
        case 'LIST_ERROR':
            return {
                ...initialStateList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}