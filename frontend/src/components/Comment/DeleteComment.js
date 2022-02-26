import React, { useReducer, useContext } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';

import { deleteComment } from './actions';
import { DeleteCommentReducer } from './reducer';
import { UserContext } from '../Context/authContext';

export default function DeleteComment(props) {
    const userData = useContext(UserContext);
    const [StaticRange, dispatch] = useReducer(DeleteCommentReducer);

    const deleteCommentHandler = async () => {
        const response = await deleteComment(dispatch, userData.user.token.key, props.commentId)
        if (response?.result) {
            props.setCommentDeleted(true)
        }
    }

    return (
        <Container style={{ display: 'flex', paddingLeft: '0', paddingRight: '0' }}>
            <Button variant='danger'
                style={{ paddingTop: '0', paddingBottom: '0' }}
                onClick={() => deleteCommentHandler()}>
                delete
            </Button>
        </Container>
    )
}