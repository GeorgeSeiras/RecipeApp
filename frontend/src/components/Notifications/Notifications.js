import React, { useRef, useEffect, useState, useReducer } from 'react';
import Image from 'react-bootstrap/Image'
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Overlay from 'react-bootstrap/esm/Overlay';
import ListGroup from 'react-bootstrap/ListGroup';

import { getNotifications, setSocket, setNotificationsAsRead, pushNotification } from '../../actions/NotificationActions'
import { NotificationReducer } from '../../reducers/NotificationsReducer'

import notification_bell from '../../static/notification_bell.svg'
import PaginationBar from './Pagination';

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

            {state?.notifications?.new >0 &&
                <Badge
                    pill
                    bg="danger"
                    style={{
                        width: '20px',
                        height: '20px',
                        position: "absolute",
                        top: "-5px",
                        right: "0",
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
            <Overlay
                show={show}
                target={ref.current}
                placement={'bottom'}
                rootClose={true}
                onHide={() => setShow(false)}
            >
                {({ placement, arrowProps, show: _show, popper, ...props }) => (

                    <ListGroup {...props} style={{ ...props.style, position: 'fixed' }}>
                        {state?.notifications?.results.map((notification, index) => {
                            return (
                                <ListGroup.Item action href={`${REACT_URL}/recipe/${notification.comment.recipe}/comment/${notification.comment.id}`}
                                    key={index}
                                    style={{ maxWidth: '250px' }}>
                                    {
                                        `${notification.type}` !== 'REPLY'
                                            ? `${notification.sender.username} has commented in one of your recipes`
                                            : `${notification.sender.username} has replied to one of your comments`
                                    }
                                </ListGroup.Item>
                            )
                        })}
                        {state?.notifications?.results &&
                            <ListGroup.Item>
                                <PaginationBar response={state?.notifications} active={active} setClicked={setPageClicked} />
                            </ListGroup.Item>
                        }
                    </ListGroup>
                )}
            </Overlay>
        </Container>
    )
}