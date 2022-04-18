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
            const folderCount = initialState?.folders?.count;
            const mediaCount = initialState?.media?.count;
            let folders = [action.payload, ...initialState.folders.results]
            let media = initialState.media
            if (mediaCount) {
                if (folderCount + mediaCount === 16) {
                    media.count -= 1
                    media.results = [...initialState.media.results.slice(0, mediaCount - 1)]
                }
            } else if (folderCount === 16) {
                folders = [action.payload, ...initialState.folders.results.slice(0, folderCount - 1)]
            }
            const folderFinal = JSON.parse(JSON.stringify(initialState.folders))
            folderFinal.results = folders
            if (folderFinal.count !== 16) {
                folderFinal.count += 1
            }
            return {
                ...initialState,
                folders: folderFinal,
                media: media
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