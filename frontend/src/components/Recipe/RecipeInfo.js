import React from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

export default function RecipeInfo(props) {
    return (
        <div>
            <Container >
                <Row xs="auto">
                    {props?.avatar &&
                        <Col style={{ paddingRight: "5" }}>
                            <Image
                                width='60'
                                className='img-fluid rounded-circle'
                                src={`${props.avatar}`}
                                alt='avatar'
                            />
                        </Col>
                    }
                    <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                        <h6 style={{ position: 'relative', top: '35%' }}>
                            Written By:
                        </h6>
                    </Col>
                    {props?.userData?.user?.user &&
                        <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                            <Nav.Item style={{ position: 'relative', top: '18%' }}>
                                <Nav.Link
                                    style={{ color: 'black' }}
                                    href={`/user/${props.userData.user.user.username}`}>
                                    {props.userData.user.user.username}
                                </Nav.Link>
                            </Nav.Item>
                        </Col>
                    }
                </Row>
                <Row xs="auto" >
                    <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                        {props?.createdAt &&
                            <h6>
                                Posted: {props.createdAt.toLocaleString()}
                            </h6>
                        }
                    </Col>
                    <Col style={{ paddingRight: "0" }}>
                        {props?.updatedAt &&
                            <h6>
                                Updated: {props.updatedAt.toLocaleString()}
                            </h6>
                        }
                    </Col>
                </Row>
            </Container>
        </div>

    )
}