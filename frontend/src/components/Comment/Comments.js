import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { loadMoreComments, getRecipeComments } from './actions';
import { RecipeCommentsReducer } from './reducer';
import CreateComment from './CreateComment';
import Comment from './Comment';
import { UserContext } from '../Context/authContext';

export default function Comments() {
    const [newComment, setNewComment] = useState('')
    const [page, setPage] = useState(1)
    const { id } = useParams();
    const [state, dispatch] = useReducer(RecipeCommentsReducer);
    const [comments, setComments] = useState(null);
    const [hiddenInputs, setHiddenInputs] = useState([]);
    const [parentIds, setParentIds] = useState([]);
    const [createdComment, setCreatedComment] = useState(false)
    const [successAlert, setSuccessAlert] = useState(null);
    const userData = useContext(UserContext);

    useEffect(() => {
        (async () => {
            if (createdComment) {
                setSuccessAlert(true)
            }
            const responseComments = await getRecipeComments(dispatch, id);
            if (responseComments) {
                setComments(responseComments)
            }
            setCreatedComment(false);
        })()
    }, [createdComment])

    const validateForm = () => {
        return newComment !== '' ? true : false;
    }

    const loadMore = async (next) => {
        const response = await loadMoreComments(dispatch, next)
        if (response) {
            var copy = Object.assign({}, comments)
            copy.results.push(...response.results);
            copy.links = response.links;
            copy.page = response.page;
            copy.total_pages = response.total_pages;
            setComments(copy)
        }
    }

    const renderNestedComments = (commentsToRender, depth) => {
        return (
            commentsToRender?.map((comment, index) => {
                if (index < comments.results.length - 1 || (index === 0 && comments.results.length === 1)) {
                    if (depth <= 8) {
                        return (
                            <Comment comment={comment} depth={depth} renderNestedComments={renderNestedComments}
                                key={comment.id} setCreatedComment={setCreatedComment} createdComment={createdComment} dispatch={dispatch} />
                        )
                    } else if (depth === 9) {
                        return (
                            <Row key={comment.id} style={{ paddingBottom: '0.5em' }}>
                                <Card>
                                    <Card.Body style={{ paddingBottom: '0.5em' }}>
                                        <Card.Link href={`${window.location.pathname}/comment/${comment.id}`}>Continue This Thread</Card.Link>
                                    </Card.Body>
                                </Card>
                            </Row>
                        )
                    }
                }
                else if (comments?.links?.next !== null && index === comments.results.length - 1) {
                    return (
                        <Row key={comment.id} style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
                            <Button onClick={() => loadMore(comments.links.next)}>
                                Load More Comments
                            </Button>
                        </Row>
                    )
                }
            })
        )
    }

    return (

        <Container>
            {successAlert &&
                <Alert variant={'success'} onClose={() => { setSuccessAlert(null) }} dismissible>
                    Comment Successfuly Created!
                </Alert>}
            {userData?.user?.isAuth &&
                <CreateComment setCreatedComment={setCreatedComment}
                    createdComment={createdComment} dispatch={dispatch} />
            }
            {comments &&
                renderNestedComments(comments?.results, 0)
            }
        </Container>
    )
}