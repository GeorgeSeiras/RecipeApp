export const initialState = {
    results: null,
    loading: false,
    errorMessage: null
}

export const RecipeCommentsReducer = (initialState, action) => {
    
    switch (action.type) {
        case 'COMMENTS_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'COMMENTS_SUCCESS':
            return {
                ...initialState,
                result: action.payload
            };
        case 'COMMENTS_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateComment = {
    result: null,
    loading: false,
    errorMessage: null
}

export const CreateCommentReducer = (initialStateComment, action) => {
    
    switch (action.type) {
        case 'CREATE_COMMENT_REQUEST':
            return {
                ...initialState,
                loading: true
            };
        case 'CREATE_COMMENT_SUCCESS':
            return {
                ...initialState,
                result: action.payload
            };
        case 'CREATE_COMMENT_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

