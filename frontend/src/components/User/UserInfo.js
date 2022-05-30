import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import NO_AVATAR from '../../static/no_avatar.svg';

export default function UserInfo(props) {

    const [avatar, setAvatar] = useState();
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';
    useEffect(() => {
        if (props?.user?.image) {
            setAvatar(MEDIA_URL + props.user.image);
        } else {
            setAvatar(NO_AVATAR);
        }
    }, [props?.user,MEDIA_URL])

    return (
        <div>
            {props?.user &&
                <Container style={{paddingTop:'1em'}}>
                    <Row>
                        <Col style={{
                            margin: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                width="300"
                                className="mx-auto d-block"
                                src={`${avatar}`}
                                alt='avatar'
                            />
                        </Col>
                    </Row>
                    <Row xs='auto' style={{ paddingTop: '1em' }}>
                        <Col style={{
                            margin: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <h5>{props.user.username}</h5>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    )
}