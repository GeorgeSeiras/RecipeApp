import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const { id } = useParams();
    const [state, dispatch] = useReducer(RecipeCommentsReducer);
    const [successAlert, setSuccessAlert] = useState(null);
    const userData = useContext(UserContext);
    const navigate = useNavigate();

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

    const loadMore = async (next) => {
        const response = await loadMoreComments(dispatch, next)
    }

    const renderNestedComments = (commentsToRender, depth) => {
        return (
            commentsToRender?.map((comment) => {
                if (depth <= 8) {
                    return (
                        <Comment comment={comment} depth={depth} renderNestedComments={renderNestedComments}
                            key={comment.id} setSuccessAlert={setSuccessAlert} dispatch={dispatch} />
                    )
                } else if (depth === 9) {
                    return (
                        <Row key={comment.id + 'continue'} style={{ paddingBottom: '0.5em' }}>
                            <Card>
                                <Card.Body style={{ paddingBottom: '0.5em' }}>
                                    <Card.Text style={{
                                        cursor: 'pointer',
                                        color: 'blue',
                                        textDecoration: 'underline'
                                    }}
                                        onClick={() => navigate(`${window.location.pathname}/comment/${comment.id}`,
                                            { state: { comments: comment } })}>
                                        Continue This Thread
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row >
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
            {state?.comments?.links?.next !== null &&
                <Row style={{ paddingBottom: '0.5em', marginLeft: `0.5em`, marginRight: '-0.81em' }}>
                    <Button onClick={() => loadMore(state.comments.links.next)}>
                        Load More Comments
                    </Button>
                </Row>
            }
        </Container>
    )
}