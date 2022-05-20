
export const initialState = {
    notifications:null,
    errorMessage: null
}

export const NotificationReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_NOTIFICATIONS':
            return {
                ...initialState,
                notifications: action.payload
            };
        case 'NOTIFICATIONS_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}