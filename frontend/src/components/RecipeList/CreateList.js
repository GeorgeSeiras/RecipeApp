import React, { useState, useReducer } from 'react'
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { createList } from './actions';
import { CreateListReducer } from './reducer';

export default function CreateList(props) {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [state, dispatch] = useReducer(CreateListReducer);

    const disabled = () => {
        if (title === '') {
            return false
        } else {
            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {}
        if (title !== '') {
            payload['name'] = title;
        }
        if (desc !== '') {
            payload['desc'] = desc;
        }
        const response = await createList(dispatch, props.userData.user.token.key, payload);
        if (response?.result) {
            const copy = props.lists.slice();
            copy.pop();
            copy.splice(0,0,response.result);
            props.setLists(copy);
        }
    }

    const overlay = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Create List</Popover.Header>
            <Popover.Body>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            placeholder='Title'
                            value={title}
                            maxLength='20'
                            onChange={(e) => setTitle(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea'
                            placeholder='Description'
                            value={desc}
                            maxLength='150'
                            rows={3}
                            onChange={(e) => setDesc(e.target.value)}>
                        </Form.Control>
                        <Button type='submit' variant='success' disabled={!disabled()}>
                            Create List
                        </Button>
                    </Form.Group>
                </Form>
            </Popover.Body>
        </Popover >
    )

    return (
        <OverlayTrigger trigger="click" placement="right" overlay={overlay}>
            <Button variant="success">New List</Button>
        </OverlayTrigger>
    )
}