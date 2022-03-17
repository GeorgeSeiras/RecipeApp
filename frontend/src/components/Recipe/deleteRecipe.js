import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { deleteRecipe } from '../CreateRecipe/actions';
import { DeleteRecipeReducer } from '../CreateRecipe/reducer';

export default function DeleteRecipe(props) {
    const [showModal, setShowModal] = useState(false);
    const [state, dispatch] = useReducer(DeleteRecipeReducer);
    const navigate = useNavigate();

    const handleDelete = async () => {
        const response = await deleteRecipe(dispatch, props.recipe.id, props.userData.user.token.key);
        if (response?.result) {
            navigate('/')
        }
    }

    return (
        <Container style={{ display: 'table-cell', paddingLeft: '0' }}>
            <Button variant='danger' size='sm' onClick={() => setShowModal(true)}>
                Delete
            </Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Recipe?
                    This action is not reversible
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}