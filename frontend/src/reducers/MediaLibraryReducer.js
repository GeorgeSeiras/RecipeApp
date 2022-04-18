const initialState = {
    curFolder: null,
    folders: null,
    media: null,
    mediaOffset: null,
    mediaLimit: null,
    errorMessage: null,
    depth: 0
}

export const MediaLibraryReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_FOLDERS':
            let limit = null
            if (action.payload.page_size > action.payload.count) {
                limit = 16 - action.payload.count
            }
            let mediaOffset = 0
            if (initialState?.mediaOffset) {
                mediaOffset = initialState.mediaOffset
            }
            return {
                ...initialState,
                folders: action.payload,
                mediaLimit: limit || null,
                mediaOffset: mediaOffset
            };
        case 'SET_CURFOLDER':
            return {
                ...initialState,
                curFolder: action.payload
            }
        case 'CREATE_FOLDER':
            return {
                ...initialState,
                folders: [action.payload, ...initialState.folders]
            }
        case 'DELETE_FOLDER':
            return {
                ...initialState,
                folders: initialState.folders.results.filter(folder => {
                    return folder.id !== action.payload.folder.id
                })
            };
        case 'UPDATE_DEPTH':
            return {
                ...initialState,
                depth: action.payload
            }
        case 'GET_MEDIA':
            return {
                ...initialState,
                media: action.payload,
                mediaOffset: Number(initialState.mediaOffset) + Number(action.payload.count)
            }
        case 'CREATE_MEDIA':
            return {
                ...initialState,
                media: [action.payload, initialState.media]
            }
        case 'DELETE_MEDIA':
            return {
                ...initialState,
                media: initialState.media.results.filter(media => {
                    return media.id !== action.payload.media.id
                })
            }
        case 'MEDIA_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}