import React, { createRef, useState,useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { UserContext } from '../Context/authContext';

import CreateComment from './CreateComment';
import DeleteComment from './DeleteComment';

export default function Comment(props) {
    const [commentDeleted,setCommentDeleted] = useState(false);
    const ref = createRef(null);
    const userData = useContext(UserContext);

    useEffect(() => {
        if (props.createdComment) {
            ref.current.style.display = 'none';

        }
    }, [props.createdComment])

    const toggleNewComment = (e) => {

        switch (ref.current.style.display) {
            case 'block':
                ref.current.style.display = 'none';
                return;
            case 'none':
                ref.current.style.display = 'block';
        }
    }

    return (
        <Row key={props.comment.id} style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
            <Card style={{ marginRight: '0' }}>
                <Card.Body style={{ paddingBottom: '0.5em' }}>
                    <Card.Text>{commentDeleted?'[deleted]':props.comment.text}</Card.Text>
                    <Row xs="auto" style={{ justifyContent: 'space-between' }}>
                        <Col>
                            <Button
                                variant='success'
                                style={{ paddingTop: '0', paddingBottom: '0' }}
                                onClick={(e) => toggleNewComment(e)}
                            >
                                reply
                            </Button>
                        </Col>
                        { props.comment.user === userData.user.user.id &&
                            !props.comment.deleted && !commentDeleted &&
                            <Col>
                                <DeleteComment commentId={props.comment.id} setCommentDeleted={setCommentDeleted}/>
                            </Col>
                        }
                    </Row>
                    <Row style={{ display: 'none', paddingTop: '0.5em' }} ref={ref}>
                        <CreateComment setCreatedComment={props.setCreatedComment} parentId={props.comment.id} />
                    </Row>
                </Card.Body>
                {props.comment.children.length > 0 &&
                    props.renderNestedComments(props.comment.children, props.depth + 1)}
            </Card>
        </Row >
    )
}