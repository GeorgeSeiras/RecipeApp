
export const initialState = {
    rating: null,
    userRating: null,
    hasRated:false,
    loading: false,
    errorMessage: null
}

export const RatingReducer = (initialState, action) => {
    switch (action.type) {
        case 'RATE_RECIPE':
            return {
                ...initialState,
                userRating: action.payload
            };
        case 'GET_USER_RECIPE_RATING':
            return {
                ...initialState,
                userRating: action.payload,
                hasRated:true
            };
        case 'RATING_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}