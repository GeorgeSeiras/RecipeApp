export const initialStateGetLists = {
    lists: null,
    loading: false,
    errorMessage: null
}

export const GetUserListsReducer = (initialStateGetLists, action) => {
    switch (action.type) {
        case 'GET_USER_LISTS_REQUEST':
            return {
                ...initialStateGetLists,
                loading: true
            };
        case 'GET_USER_LISTS_SUCCESS':
            return {
                ...initialStateGetLists,
                lists: action.payload?.lists
            };
        case 'GET_USER_LISTS_ERROR':
            return {
                ...initialStateGetLists,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateGetList = {
    list: null,
    loading: false,
    errorMessage: null
}

export const GetListRecipesReducer = (initialStateGetList, action) => {
    switch (action.type) {
        case 'GET_LIST_RECIPES_REQUEST':
            return {
                ...initialStateGetList,
                loading: true
            };
        case 'GET_LIST_RECIPES_SUCCESS':
            return {
                ...initialStateGetList,
                lists: action.payload?.list
            };
        case 'GET_LIST_RECIPES_ERROR':
            return {
                ...initialStateGetList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateList = {
    list: null,
    loading: false,
    errorMessage: null
}

export const CreateListReducer = (initialStateList, action) => {
    switch (action.type) {
        case 'CREATE_LIST_REQUEST':
            return {
                ...initialStateList,
                loading: true
            };
        case 'CREATE_LIST_SUCCESS':
            return {
                ...initialStateList,
                list: action.payload?.result
            };
        case 'CREATE_LIST_ERROR':
            return {
                ...initialStateList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const GetListReducer = (initialStateList, action) => {
    switch (action.type) {
        case 'GET_LIST_REQUEST':
            return {
                ...initialStateList,
                loading: true
            };
        case 'GET_LIST_SUCCESS':
            return {
                ...initialStateList,
                list: action.payload?.result
            };
        case 'GET_LIST_ERROR':
            return {
                ...initialStateList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateDelete = {
    result: null,
    loading: false,
    errorMessage: null
}

export const DeleteListReducer = (initialStateDelete, action) => {
    switch (action.type) {
        case 'DELETE_LIST_REQUEST':
            return {
                ...initialStateDelete,
                loading: true
            };
        case 'DELETE_LIST_SUCCESS':
            return {
                ...initialStateDelete,
                result: action.payload?.result
            };
        case 'DELETE_LIST_ERROR':
            return {
                ...initialStateDelete,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}