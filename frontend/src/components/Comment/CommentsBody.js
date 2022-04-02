import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import Comment from './Comment';
import { loadMoreComments } from '../../actions/CommentActions';

export default function CommentsBody(props) {


    const loadMore = async (next) => {
        const response = await loadMoreComments(props?.dispatch, next)
    }

    const renderNestedComments = (commentsToRender, depth) => {
        return (
            commentsToRender?.map((comment) => {
                if (depth < 9) {
                    return (
                        <Comment comment={comment} depth={depth} renderNestedComments={renderNestedComments}
                            key={comment.id} setSuccessAlert={props.setSuccessAlert} dispatch={props.dispatch} />
                    )
                } else if (depth === 9) {
                    return (
                        <Container key={comment.id}>
                            <Row style={{ paddingBottom: '0.5em' }}>
                                <Card>
                                    <Card.Body style={{ paddingBottom: '0.5em' }}>
                                        <Card.Text style={{
                                            cursor: 'pointer',
                                            color: 'blue',
                                            textDecoration: 'underline'
                                        }} >
                                            <Link
                                                to={`comment/${comment.id}`}
                                                target={'_blank'}
                                            >
                                                Continue This Thread
                                            </Link>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Row >
                        </Container>
                    )
                }
            })
        )
    }

    return (
        <Container>
            {props?.state?.comments &&
                renderNestedComments(props?.state.comments?.results, 0)
            }
            {props?.state?.comments?.links?.next !== null &&
                <Row style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
                    <Button onClick={() => loadMore(props.state.comments.links.next)}>
                        Load More Comments
                    </Button>
                </Row>
            }
        </Container>
    )

}