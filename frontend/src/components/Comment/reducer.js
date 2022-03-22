export const initialState = {
    comments:null,
    results: null,
    loading: false,
    errorMessage: null
}

export const RecipeCommentsReducer = (initialState, action) => {

    switch (action.type) {
        case 'GET_COMMENTS_SUCCESS':
            return {
                ...initialState,
                comments: action.payload
            };
        case 'CREATE_COMMENT_SUCCESS':
            return {
                ...initialState,
                result: action.payload
            }
        case 'DELETE_COMMENT_SUCCESS':
            return {
                ...initialState,
                result: action.payload
            };
        case 'REPLACE_COMMENTS':
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