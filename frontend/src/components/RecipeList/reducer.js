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

export const GetListReducer = (initialStateGetList, action) => {
    switch (action.type) {
        case 'GET_LIST_REQUEST':
            return {
                ...initialStateGetList,
                loading: true
            };
        case 'GET_LIST_SUCCESS':
            return {
                ...initialStateGetList,
                lists: action.payload?.list
            };
        case 'GET_LIST_ERROR':
            return {
                ...initialStateGetList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateCreateList = {
    list: null,
    loading: false,
    errorMessage: null
}

export const CreateListReducer = (initialStateCreateList, action) => {
    switch (action.type) {
        case 'CREATE_LIST_REQUEST':
            return {
                ...initialStateCreateList,
                loading: true
            };
        case 'CREATE_LIST_SUCCESS':
            return {
                ...initialStateCreateList,
                list: action.payload?.result
            };
        case 'CREATE_LIST_ERROR':
            return {
                ...initialStateCreateList,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}