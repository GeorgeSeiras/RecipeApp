import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { loadMoreComments, getRecipeComments } from '../../actions/CommentActions';
import { RecipeCommentsReducer } from '../../reducers/CommentReducer';
import CreateComment from './CreateComment';
import Comment from './Comment';
import { UserContext } from '../Context/authContext';

export default function Comments() {
    const [newComment, setNewComment] = useState('')
    const [page, setPage] = useState(1)
    const { id } = useParams();
    const [state, dispatch] = useReducer(RecipeCommentsReducer);
    const [hiddenInputs, setHiddenInputs] = useState([]);
    const [parentIds, setParentIds] = useState([]);
    const [successAlert, setSuccessAlert] = useState(null);
    const userData = useContext(UserContext);

    useEffect(() => {
        (async () => {
            await getRecipeComments(dispatch, id);
        })();
    }, [])

    useEffect(() => {
        (async () => {
            if (state?.created) {
                await getRecipeComments(dispatch, id);
            }
        })()
    }, [state?.created])

    const validateForm = () => {
        return newComment !== '' ? true : false;
    }

    const loadMore = async (next) => {
        const response = await loadMoreComments(dispatch, next)
    }

    const renderNestedComments = (commentsToRender, depth) => {
        return (
            commentsToRender?.map((comment, index) => {
                if (index < state.comments.results.length - 1 || (index === 0 && state.comments.results.length === 1)) {
                    if (depth <= 8) {
                        return (
                            <Comment comment={comment} depth={depth} renderNestedComments={renderNestedComments}
                                key={comment.id} setSuccessAlert={setSuccessAlert} dispatch={dispatch} />
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
                else if (state.comments?.links?.next !== null && index === state.comments.results.length - 1) {
                    return (
                        <Row key={comment.id} style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
                            <Button onClick={() => loadMore(state.comments.links.next)}>
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
                <CreateComment setSuccessAlert={setSuccessAlert} dispatch={dispatch} />
            }
            {state?.comments &&
                renderNestedComments(state.comments?.results, 0)
            }
        </Container>
    )
}