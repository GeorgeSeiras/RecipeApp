import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
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

    console.log(props.recipe)
    return (
        <div>
            <Container  >
                <Row xs="auto">
                    <Col style={{
                        paddingTop: "2%",
                        margin: "auto",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h2 >{props.recipe?.title}</h2>
                    </Col>
                </Row>
                <Row xs="auto" style={{
                    margin: "auto",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {props.recipe?.course &&
                        <Col style={{ paddingRight: "1%" }}>
                            <h6>Course: </h6>
                        </Col>
                    }
                    {props.recipe?.course &&
                        <Col style={{ paddingLeft: "0" }}>
                            <h6>
                                {props.recipe?.course.map((course, index) => {
                                    if (index !== props.recipe.course.length - 1) {
                                        return course + ", ";
                                    } else {
                                        return course;
                                    }
                                })}
                            </h6>
                        </Col>
                    }
                    {props.recipe?.cuisine &&
                        <Col style={{ paddingRight: "1%" }}>
                            <h6>Cuisine: </h6>
                        </Col>
                    }
                    {props.recipe?.cuisine &&
                        <Col style={{ paddingLeft: "0" }}>
                            <h6>
                                {props.recipe?.cuisine.map((cuisine, index) => {
                                    if (index !== props.recipe.cuisine.length - 1) {
                                        return cuisine + ", ";
                                    } else {
                                        return cuisine;
                                    }
                                })}
                            </h6>
                        </Col>
                    }
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
                    {props?.userData?.user?.user &&
                        <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                            <h6>
                                <Nav.Item  >
                                    <Nav.Link
                                        style={{ color: 'black'}}
                                        href={`/user/${props.userData.user.user.username}`}>
                                        {props.userData.user.user.username}
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
            </Container>
        </div >

    )
}