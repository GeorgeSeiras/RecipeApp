export const initialState = {
    comments: null,
    created: null,
    errorMessage: null
}

export const RecipeCommentsReducer = (initialState, action) => {

    switch (action.type) {
        case 'GET_COMMENTS':
            return {
                ...initialState,
                comments: action.payload,
                created: false
            };
        case 'LOAD_COMMENTS':
            var copy = Object.assign({}, initialState.comments)
            copy.results.push(...action.payload.results);
            copy.links = action.payload.links;
            copy.page = action.payload.page;
            copy.total_pages = action.payload.total_pages;
            return {
                ...initialState,
                comments: copy,
                created: false
            }
        case 'CREATE_COMMENT':
            return {
                ...initialState,
                created: true
            }
        case 'DELETE_COMMENT':
            return {
                ...initialState,
                result: action.payload
            };
        case 'REPLACE_COMMENTS':
            return {
                ...initialState,
                comments: action.payload
            }
        case 'GET_CONTINUE_THREAD_COMMENTS':
            return {
                ...initialState,
                comments: action.payload
            }
        case 'COMMENT_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}