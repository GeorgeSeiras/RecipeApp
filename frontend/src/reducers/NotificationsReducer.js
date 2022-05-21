
export const initialState = {
    notifications: null,
    socket: null,
    errorMessage: null
}

export const NotificationReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_NOTIFICATIONS':
            return {
                ...initialState,
                notifications: action.payload
            };
        case 'SET_AS_READ':
            var notifications = initialState.notifications;
            notifications.new = 0;
            return {
                ...initialState,
                notifications: notifications
            }
        case 'SET_SOCKET':
            return {
                ...initialState,
                socket: action.payload
            }
        case 'PUSH_NOTIFICATION':
            const pageSize = initialState?.notifications?.page_size
            var notifications = initialState.notifications
            notifications.new++
            if (initialState.notifications.length < pageSize) {
                notifications.results.push(action.payload)
                return {
                    ...initialState,
                    notifications: notifications
                }
            } else {
                notifications.results.splice(pageSize - 1, 1)
                notifications.results.unshift(action.payload)
                return {
                    ...initialState,
                    notifications: notifications
                }
            }

        case 'NOTIFICATIONS_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}