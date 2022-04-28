import React, { useState, useEffect, useReducer, useContext } from 'react'
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

import { UserContext } from '../Context/authContext';
import { getReport, updateReport } from '../../actions/ReportActions';
import { ReportReducer } from '../../reducers/ReportReducer';

export default function Report() {

    const [state, dispatch] = useReducer(ReportReducer);
    const userData = useContext(UserContext);
    const { reportId } = useParams();

    useEffect(() => {
        (async () => {
            await getReport(dispatch, reportId, userData.user.token.key)
        })()
    }, [reportId])

    const getBackgroundColor = (value) => {
        let color = ''
        switch (value) {
            case 'PENDING':
                color = 'green'
                break;
            case 'CLOSED':
                color = 'gray'
                break;
            case 'REMOVED':
                color = 'red';
                break;
            default:
                return '';
        }
        return color
    }

    const getLink = (value) => {
        switch (value.content_object.model) {
            case 'recipe':
                return `/recipe/${value.content_object.id}`
        }
    }

    const handleVerdictButton = async (value) => {
        switch (value) {
            case 'CANCEL':
                await updateReport(dispatch, { 'status': 'CLOSED' }, reportId, userData.user.token.key)
                break;
            case 'REMOVE':
                await updateReport(dispatch, { 'status': 'REMOVED' }, reportId, userData.user.token.key)
                break;
        }
    }
    return (
        <Container style={{ justifyContent: 'center' }}>
            {state?.report &&
                <>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>STATUS</th>
                                <th style={{ textAlign: 'center' }}>REASON</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center', backgroundColor: getBackgroundColor(state.report.status) }}>
                                    {state.report.status}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {state.report.reason}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    {state.report.desc}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'center' }}>
                                    <Link
                                        to={getLink(state.report)}
                                        target={'_blank'}
                                    >
                                        View Related Content
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'center' }}>
                                    <DropdownButton title='Pass Verdict'>
                                        <Dropdown.Item
                                            style={{ backgroundColor: 'gray', textAlign: 'center' }}
                                            onClick={(e) => handleVerdictButton('CANCEL')}
                                        >
                                            CLOSE REPORT
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            style={{ backgroundColor: 'red', textAlign: 'center' }}
                                            onClick={(e) => handleVerdictButton('REMOVE')}
                                        >
                                            REMOVE CONTENT
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </>
            }
        </Container>

    )
}