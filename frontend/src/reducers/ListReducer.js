export const initialStateUserLists = {
    lists: null,
    listsWithRecipe: null,
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
        case 'GET_LISTS_WITH_RECIPE':
            return {
                ...initialStateUserLists,
                listsWithRecipe: action.payload
            };
        case 'ADD_RECIPE_TO_LIST':
            return {
                ...initialStateUserLists,
                listsWithRecipe: [...initialStateUserLists.listsWithRecipe, action.payload.list.id]
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
        case 'LIST_ERROR':
            return {
                ...initialStateList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}