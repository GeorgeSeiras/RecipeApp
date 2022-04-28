export const initialStateReports = {
    reports: null,
    errorMessage: null
}

export const ReportsReducer = (initialStateReports, action) => {
    switch (action.type) {
        case 'GET_REPORTS':
            return{
                ...initialStateReports,
                reports:action.payload
            }
        case 'REPORTS_ERROR':
            return{
                ...initialStateReports,
                errorMessage:action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const initialStateReport = {
    report: null,
    errorMessage: null
}

export const ReportReducer = (initialStateReport, action) => {
    switch (action.type) {
        case 'CREATE_REPORT':
            return{
                ...initialStateReport,
                report:action.payload
            }
        case 'GET_REPORT':
            return{
                ...initialStateReport,
                report:action.payload
            }
        case 'UPDATE_REPORT':
            return{
                ...initialStateReport,
                report:action.payload
            }
        case 'REPORT_ERROR':
            return{
                ...initialStateReport,
                errorMessage:action.errorMessage
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
