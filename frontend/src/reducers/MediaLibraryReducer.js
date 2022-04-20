const initialState = {
    curFolder: null,
    foldersAndMedia: null,
    errorMessage: null
}

export const MediaLibraryReducer = (initialState, action) => {
    switch (action.type) {
        case 'GET_FOLDERS_AND_MEDIA':
            return {
                ...initialState,
                foldersAndMedia: action.payload,
            };
        case 'SET_CURFOLDER':
            return {
                ...initialState,
                curFolder: action.payload,
                mediaOffset: 0
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
            var folderFinal = JSON.parse(JSON.stringify(initialState.folders))
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
            const folderCountMedia = initialState?.folders?.count;
            const mediaCountMedia = initialState?.media?.count;
            var foldersMedia = JSON.parse(JSON.stringify(initialState?.folders))
            var mediaMedia = JSON.parse(JSON.stringify(initialState?.media))
            if (folderCountMedia && folderCountMedia === 16) {
                foldersMedia.results.slice(0, 15)
                mediaMedia.results = [action.payload, ...mediaMedia.results]
            } else if (mediaCountMedia && folderCountMedia + mediaCountMedia === 16) {
                mediaMedia.results = [action.payload, ...mediaMedia.results.slice(0, mediaCountMedia - 1)]
            } else {
                mediaMedia.results = [action.payload, ...mediaMedia.results]
                mediaMedia.count += 1
            }
            return {
                ...initialState,
                media: mediaMedia,
                folder: foldersMedia
            }
        case 'DELETE_MEDIA':
            return {
                ...initialState,
                media: initialState.media.results.filter(media => {
                    return media.id !== action.payload.media.id
                })
            }
        case 'SET_PAGE_COUNT':
            return {
                ...initialState,
                pageCount: action.payload
            }
        case 'MEDIA_ERROR':
            return {
                ...initialState,
                errorMessage: action.errorMessage,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
} 