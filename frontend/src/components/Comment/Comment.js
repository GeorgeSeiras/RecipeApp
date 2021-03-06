import React, { createRef, useState, useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

import { UserContext } from '../Context/authContext';
import CreateComment from './CreateComment';
import DeleteComment from './DeleteComment';
import no_avatar from '../../static/no_avatar.svg'
import ReportButton from '../Report/CreateReportButton';

export default function Comment(props) {
    const [commentDeleted, setCommentDeleted] = useState(false);
    const ref = createRef(null);
    const userData = useContext(UserContext);
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';

    useEffect(() => {
        if (props.setSuccessAlert) {
            ref.current.style.display = 'none';

        }
    }, [props.setSuccessAlert])

    const toggleNewComment = (e) => {

        switch (ref.current.style.display) {
            case 'block':
                ref.current.style.display = 'none';
                return;
            case 'none':
                ref.current.style.display = 'block';
        }
    }

    const commentText=(comment)=>{
        if(comment.removed){
            return '[removed]'
        }else if(comment.deleted){
            return '[deleted]'
        }else{
            return comment.text
        }
    }

    return (
        <Row key={props.comment.id} style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
            <Card style={{ marginRight: '0' }}>
                <Card.Body style={{ paddingBottom: '0.5em' }}>
                    <Card.Text>{commentText(props.comment)}</Card.Text>
                </Card.Body>
                <Card.Footer style={{ paddingLeft: '0', paddingBottom: '0', paddingTop: '0', paddingRight: '0' }}>
                    <Row className='container-fluid me-auto' xs="auto" style={{ alignItems: 'center', paddingLeft: '0', marginLeft: '0', paddingRight: '0' }}>
                        <Col style={{ paddingRight: "0" }}>
                            <Image
                                width='30'
                                className='img-fluid rounded-circle'
                                src={`${props.comment.user?.image ? MEDIA_URL + props.comment.user.image : no_avatar}`}
                                alt='avatar'
                            />
                        </Col>
                        <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                            <h6 style={{ marginBottom: '0' }}>
                                <Nav.Item>
                                    <Nav.Link
                                        style={{ paddingTop: '0', paddingBottom: '0', color: 'black' }}
                                        href={`/user/${props.comment?.user?.username}`}>
                                        {props.comment?.user?.username}
                                    </Nav.Link>
                                </Nav.Item>
                            </h6>
                        </Col>
                        <Row className='container-fluid ms-auto' style={{ paddingRight: '0' }}>
                            <Col style={{ display: 'block', alignItems: 'center' }}>
                                {userData?.user?.isAuth &&
                                    <Button
                                        variant='success'
                                        style={{ paddingTop: '0', paddingBottom: '0' }}
                                        onClick={(e) => toggleNewComment(e)}
                                    >
                                        reply
                                    </Button>
                                }
                            </Col>
                            {props.comment.user.id === userData?.user?.user?.id &&
                                !props.comment.removed && !commentDeleted &&
                                <Col className='ms-auto'>
                                    <DeleteComment comment={props.comment} setCommentDeleted={setCommentDeleted} dispatch={props.dispatch} />
                                </Col>
                            }
                            {userData?.user?.isAuth && userData?.user?.user?.id !== props?.comment?.user?.id && !props?.comment?.removed &&
                                <Col style={{ paddingLeft: '0' }}>
                                    <ReportButton id={props.comment.id} userData={userData} type={'COMMENT'} />
                                </Col>
                            }
                        </Row>
                    </Row>
                    <Row style={{ display: 'none', paddingTop: '0.5em' }} ref={ref}>
                        <CreateComment setSuccessAlert={props.setSuccessAlert} parentId={props.comment.id}
                            dispatch={props.dispatch} recipeId={props.comment.recipe} />
                    </Row>
                </Card.Footer>
                {props.comment.children.length > 0 &&
                    props.renderNestedComments(props.comment.children, props.depth + 1)}
            </Card>
        </Row >
    )
}