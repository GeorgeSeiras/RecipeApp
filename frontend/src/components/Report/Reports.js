import React, { useReducer, useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../Context/authContext';
import { getReports } from '../../actions/ReportActions';
import { ReportsReducer } from '../../reducers/ReportReducer';
import PaginationBar from '../Home/Pagination';

export default function Reports() {

    const [state, dispatch] = useReducer(ReportsReducer);
    const userData = useContext(UserContext);
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [query, setQuery] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const res = await getReports(dispatch, query, pageClicked, userData.user.token.key)
            if (res) {
                setActive(pageClicked);
            }
        })()
    }, [pageClicked, query])

    const handleReportClick = (e) => {
        console.log(e.target.parentNode.id)
        navigate(`/reports/${e.target.parentNode.id}`)
    }

    const handleQueryButtonClick = (value) => {
        setQuery(value)
        setActive(1)
    }

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

    return (
        <Container style={{ justifyContent: 'center' }}>
            <Row style={{ paddingTop: '1.5em', paddingBottom: '1em' }}>
                <Col
                    onClick={() => handleQueryButtonClick(null)}
                    style={{ textAlign: 'center', backgroundColor: 'lightGreen', cursor: 'pointer' }}>
                    {'ALL'}
                </Col>
                <Col
                    onClick={() => handleQueryButtonClick('PENDING')}
                    style={{ textAlign: 'center', backgroundColor: 'green', cursor: 'pointer' }}>
                    {'PENDING'}
                </Col>
                <Col
                    style={{ textAlign: 'center', backgroundColor: 'gray', cursor: 'pointer' }}
                    onClick={() => handleQueryButtonClick('CLOSED')}
                >
                    {'CLOSED'}
                </Col>
                <Col
                    style={{ textAlign: 'center', backgroundColor: 'red', cursor: 'pointer' }}
                    onClick={() => handleQueryButtonClick('REMOVED')}
                >
                    {'REMOVED'}
                </Col>
            </Row>
            <Row>
                <Table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>ID</th>
                            <th style={{ textAlign: 'center' }}>STATUS</th>
                            <th style={{ textAlign: 'center' }}>REASON</th>
                            <th style={{ textAlign: 'center' }}>DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state?.reports &&
                            state.reports.results.map((report, index) => {

                                console.log(index)
                                return (
                                    <tr key={index} id={index}
                                        onClick={(e) => handleReportClick(e)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td style={{ textAlign: 'center' }}>
                                            {state.reports.page === 1
                                                ? index
                                                : state.reports.page_size * state.reports.page + index}
                                        </td>
                                        <td style={{ textAlign: 'center', backgroundColor: getBackgroundColor(report.status) }}>
                                            {report.status}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {report.reason}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {report.desc}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Row>
            <PaginationBar response={state?.reports} active={active} setPageClicked={setPageClicked} />
        </Container>
    )
}