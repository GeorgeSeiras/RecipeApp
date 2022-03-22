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
                comments: action.payload
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
                ...initialStateComment,
                loading: true
            };
        case 'CREATE_COMMENT_SUCCESS':
            return {
                ...initialStateComment,
                result: action.payload
            };
        case 'CREATE_COMMENT_ERROR':
            return {
                ...initialStateComment,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const DeleteCommentReducer = (initialStateComment, action) => {
    
    switch (action.type) {
        case 'DELETE_COMMENT_REQUEST':
            return {
                ...initialStateComment,
                loading: true
            };
        case 'DELETE_COMMENT_SUCCESS':
            return {
                ...initialStateComment,
                result: action.payload
            };
        case 'DELETE_COMMENT_ERROR':
            return {
                ...initialStateComment,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

