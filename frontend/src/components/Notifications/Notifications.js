import React, { useRef, useEffect, useState, useReducer } from 'react';
import Image from 'react-bootstrap/Image'
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Overlay from 'react-bootstrap/esm/Overlay';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { getNotifications, setSocket, setNotificationsAsRead, pushNotification } from '../../actions/NotificationActions'
import { NotificationReducer } from '../../reducers/NotificationsReducer'

import notification_bell from '../../static/notification_bell.svg'
import PaginationBar from './Pagination';
import './notifications.css'

export default function Notifications(props) {
    const BACKEND_ADDRESS = process.env.REACT_APP_BACKEND_ADDRESS;
    const socketRef = useRef();
    const [state, dispatch] = useReducer(NotificationReducer);
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [show, setShow] = useState(false);
    const ref = useRef(null);
    const REACT_URL = process.env.REACT_APP_URL

    useEffect(() => {
        if (state) {
            if (!state?.socket) {
                socketRef.current = new WebSocket('ws://' + BACKEND_ADDRESS + '/notification/' + props.userData.user.user.username)
                setSocket(dispatch, socketRef.current);
            } else {
                state.socket.onopen = e => {
                }

                state.socket.onerror = e => {
                    console.log('error', e)
                }
                state.socket.onmessage = e => {
                    pushNotification(dispatch, JSON.parse(e['data']).data.content)
                }
            }
        }
    }, [state])

    useEffect(() => {
        (async () => {
            const res = await getNotifications(dispatch, pageClicked, props.userData.user.token.key)
            if (res) {
                setActive(pageClicked);
            }
        })()
    }, [pageClicked])

    return (
        <Container style={{ position: 'relative', padding: '0' }}>
            <Nav style={{ display: 'flex', marginTop: '-10px' }}>
                <NavDropdown id='dropdown-basic-button' drop='start'
                    title={
                        <Image
                            width={35}
                            src={notification_bell}
                            alt='notification_bell'
                            ref={ref}
                            onClick={() => {
                                setShow(!show);
                                if (state.notifications.new > 0) {
                                    setNotificationsAsRead(dispatch, props.userData.user.token.key)
                                }
                            }}
                        />
                    }
                >
                    {state?.notifications?.results.map((notification, index) => {
                        return (
                            <div key={index}>
                                <NavDropdown.Item href={`${REACT_URL}/recipe/${notification.comment.recipe}/comment/${notification.comment.id}`}
                                    style={{ display: 'flex', whiteSpace: 'normal', width: '200px' }}>
                                    {
                                        `${notification.type}` !== 'REPLY'
                                            ? `${notification.sender.username} has commented in one of your recipes`
                                            : `${notification.sender.username} has replied to one of your comments`
                                    }
                                </NavDropdown.Item>
                                <NavDropdown.Divider style={{ marginTop: '2px', marginBottom: '0' }} />
                            </div>
                        )
                    })}
                    {state?.notifications?.results &&
                        <NavDropdown.Item onClick={(e) => e.stopPropagation()} style={{ paddingRight: '0', paddingLeft: '0', marginBottom: '-28px', paddingBottom: '0', paddingTop: '0' }}>
                            <PaginationBar response={state?.notifications} active={active} setClicked={setPageClicked} />
                        </NavDropdown.Item>
                    }
                </NavDropdown>
            </Nav>
            {state?.notifications?.new > 0 &&
                <Badge
                    pill
                    bg="danger"
                    style={{
                        width: '20px',
                        height: '20px',
                        position: "absolute",
                        top: "0",
                        right: "5px",
                        padding: '0',
                        paddingTop: '3px',
                        cursor: 'default'
                    }}
                    onClick={() => {
                        setShow(!show);
                        if (state.notifications.new > 0) {
                            setNotificationsAsRead(dispatch, props.userData.user.token.key)
                        }
                    }}
                >{' '}</Badge>

            }
        </Container>
    )
}