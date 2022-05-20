import React, { useRef, useEffect, useState, useReducer } from 'react';
import Image from 'react-bootstrap/Image'
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';

import { getNotifications } from '../../actions/NotificationActions'
import { NotificationReducer } from '../../reducers/NotificationsReducer'

import notification_bell from '../../static/notification_bell.svg'

export default function Notifications(props) {
    const BACKEND_ADDRESS = process.env.REACT_APP_BACKEND_ADDRESS;
    const socketRef = useRef();
    const [state, dispatch] = useReducer(NotificationReducer);
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [message, setMessage] = useState(null)
    useEffect(() => {
        socketRef.current = new WebSocket('ws://' + BACKEND_ADDRESS + '/notification/' + props.userData.user.user.username)
        socketRef.current.onopen = e => {
            // console.log('open', e)
        }

        socketRef.current.onerror = e => {
            console.log('error', e)
        }
        socketRef.current.onmessage = e => {
            console.log(JSON.parse(e['data']).content)
            // add to notification list
        }
    }, [])

    useEffect(() => {
        (async () => {
            const res = await getNotifications(dispatch, props.userData.user.token.key)
            if (res) {
                setActive(pageClicked);
            }
        })()
    }, [pageClicked])

    return (
        <>
            <Container style={{ position: 'relative', padding: '0' }}>
                <Image
                    width={35}
                    src={notification_bell}
                    alt='notification_bell'
                />
                {state?.notifications &&
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
                            paddingTop:'3px'
                        }}

                    >{state?.notifications?.new || ''}</Badge>
                }
            </Container>
        </>
    )

}