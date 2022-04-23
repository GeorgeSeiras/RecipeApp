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
            return {
                ...initialState
            }


        case 'DELETE_FOLDER':
            return {
                ...initialState
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
            }
        case 'DELETE_MEDIA':
            return {
                ...initialState
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