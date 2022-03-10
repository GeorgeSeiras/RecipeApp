import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import IMAGE_NOT_FOUND from "../../static/image_not_found.svg";

import RecipeCard from '../Home/RecipeCard';
import { UserContext } from '../Context/authContext';
import { deleteRecipeFromList } from './actions';
import { DeleteRecipeFromListReducer } from './reducer';

export default function ListRecipeCards(props) {
    const [thumbnails, setThumbnails] = useState([])
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
    const [state, dispatch] = useReducer(DeleteRecipeFromListReducer);
    const { listId } = useParams();
    const userData = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setThumbnails([])
        props?.response?.results.forEach((recipe, key) => {
            const img = recipe.images.find((image) => {
                return image.type === "THUMBNAIL"
            })?.image
            if (img) {
                setThumbnails(thumbnails => [...thumbnails, `${MEDIA_URL}${img}`]);
            } else {
                setThumbnails(thumbnails => [...thumbnails, IMAGE_NOT_FOUND]);
            }
        })
    }, [props?.response?.results, MEDIA_URL])

    const onClickHandler = async (e) => {
        const recipe = props.response.results[e.target.parentNode.id];
        removeFromList(recipe);
    }

    const removeFromList = async (recipe) => {
        const response = await deleteRecipeFromList(dispatch, listId, recipe.id, userData.user.token.key);
        if (response?.result === 'ok') {
            props.setRerender(!props.rerender)

        }
    }

    return (

        <Container>
            {props?.response?.results &&
                <Row xs={2} md={3} lg={5} className='g-4' >
                    {props.response.results.map((recipe, index) => {
                        return (
                            <Col key={index} id={index} style={{
                                position: 'relative',
                            }}>
                                <RecipeCard recipe={recipe} index={index} thumbnails={thumbnails} />
                                <Button
                                    variant="danger"
                                    style={{
                                        width: '1.5em',
                                        height: '1.5em',
                                        position: "absolute",
                                        top: "0",
                                        left: "200.5px",
                                        padding: '0',
                                        textAlign: 'center',
                                    }}
                                    onClick={(e) => onClickHandler(e)}>
                                    X
                                </Button>
                            </Col>
                        )
                    })}
                </Row>
            }
            <Modal show={showModal} onHide={() => { setShowModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove  list?
                    This action is not reversible</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false) }}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => removeFromList()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}