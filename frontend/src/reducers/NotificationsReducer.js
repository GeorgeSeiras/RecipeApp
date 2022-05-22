
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
            var notifications_new = initialState.notifications;
            notifications_new.new = 0;
            return {
                ...initialState,
                notifications: notifications_new
            }
        case 'SET_SOCKET':
            return {
                ...initialState,
                socket: action.payload
            }
        case 'PUSH_NOTIFICATION':
            const pageSize = initialState?.notifications?.page_size
            var notifications_push = initialState.notifications
            notifications_push.new++
            if (initialState.notifications.length < pageSize) {
                notifications_push.results.push(action.payload)
                return {
                    ...initialState,
                    notifications: notifications_push
                }
            } else {
                notifications_push.results.splice(pageSize - 1, 1)
                notifications_push.results.unshift(action.payload)
                return {
                    ...initialState,
                    notifications: notifications_push
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