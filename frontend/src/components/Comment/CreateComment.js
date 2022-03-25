import React, { useState, useReducer, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

import { postComment } from '../../actions/CommentActions';
import { UserContext } from '../Context/authContext';

export default function Comments(props) {
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();
    const userData = useContext(UserContext);
    // console.log(props)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            'text': newComment,
            'parent': props?.parentId
        }
        const response = await postComment(props.dispatch, payload, userData.user.token.key, id)
        if (response?.result) {
            props.setCreatedComment(true)
        }

    }

    const validateForm = () => {
        return newComment !== '' ? false : true;
    }

    return (
        <Container style={{ paddingBottom: '1em' }}>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Card>
                        <Card.Body style={{ paddingBottom: '0.5em' }}>
                            <Form.Group className='mb-3'>
                                <Form.Control as="textarea" rows={4} maxLength='250'
                                    type="text"
                                    placeholder="New Comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                type='submit'
                                variant='success'
                                disabled={validateForm()}
                                style={{ paddingTop: '0', paddingBottom: '0' }}>
                                Create Comment
                            </Button>
                        </Card.Body>
                    </Card>
                </Form>
        </Container >
    )
}