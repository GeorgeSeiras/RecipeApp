import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';

import { DateTime } from 'luxon';


export default function RecipeInfo(props) {
    const [createdAt, setCreatedAt] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);

    useEffect(() => {
        if (props.recipe?.updated_at) {
            setUpdatedAt(DateTime.fromSQL(props.recipe?.updated_at).toFormat('dd LLL yyyy'));
        }
        if (props.recipe?.created_at) {
            setCreatedAt(DateTime.fromSQL(props.recipe?.created_at).toFormat('dd LLL yyyy'));
        }
    }, [props.recipe])

    return (
        <div>
            <Container >

                <Row xs="auto">
                    <Col style={{
                        margin: "auto",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <h2 >{props.recipe?.title}</h2>
                    </Col>
                </Row>
                <Row xs="auto" style={{
                    margin: "auto",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Row xs={'auto'}>
                        {props.recipe?.course &&
                            <Col>
                                <h6>Course: </h6>
                            </Col>
                        }
                        {props.recipe?.course &&
                            props.recipe?.course.map((course, index) => {
                                return (
                                    <Col >
                                        <Badge pill bg='primary'>
                                            {course}
                                        </Badge>{' '}
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <Row xs={'auto'}>
                        {props.recipe?.cuisine &&
                            <Col >
                                <h6>Cuisine: </h6>
                            </Col>
                        }
                        {props.recipe?.cuisine &&

                            props.recipe?.cuisine.map((cuisine, index) => {
                                return (
                                    <Col >
                                        <Badge pill bg='primary'>
                                            {cuisine}
                                        </Badge>{' '}
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Row>
                <Row xs="auto" style={{
                    margin: "auto",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
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
                        <h6 style={{ position: 'relative', top: '5%' }}>
                            Written By:
                        </h6>
                    </Col>

                    {props?.userData &&
                        <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                            <h6>
                                <Nav.Item  >
                                    <Nav.Link
                                        style={{ color: 'black' }}
                                        href={`/user/${props.userData.username}`}>
                                        {props.userData.username}
                                    </Nav.Link>
                                </Nav.Item>
                            </h6>
                        </Col>
                    }
                    <Col style={{ position: 'relative' }}>
                        {createdAt &&
                            <h6 style={{ paddingRight: "0", paddingLeft: "0", position: 'relative', top: '33%' }}>
                                Posted: {createdAt.toLocaleString()}
                            </h6>
                        }
                    </Col>
                    <Col>
                        {updatedAt &&
                            <h6 style={{ paddingRight: "0", position: 'relative', top: '33%' }}>
                                Updated: {updatedAt.toLocaleString()}
                            </h6>
                        }
                    </Col>
                </Row>


            </Container >
        </div >

    )
}