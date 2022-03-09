import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { getListRecipes, getList, deleteList } from './actions';
import { GetListRecipesReducer, GetListReducer, DeleteListReducer } from './reducer';
import { UserContext } from '../Context/authContext';
import RecipeCards from '../Home/RecipeCards';
import PaginationBar from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';

export default function List() {
    const userData = useContext(UserContext);
    const [state, dispatch] = useReducer(GetListRecipesReducer);
    const [stateList, dispatchList] = useReducer(GetListReducer);
    const [stateDelete, dispatchDelete] = useReducer(DeleteListReducer);
    const [recipesResponse, setRecipeResponse] = useState();
    const [list, setList] = useState();
    const { listId } = useParams();
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        (async () => {
            const response = await getList(dispatchList, listId);
            if (response?.result) {
                setList(response.result);
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {
            const res = await getListRecipes(dispatch, listId, userData.user.token.key, queryParams, pageClicked);
            if (res) {
                const recipes = [];
                res.results.forEach(item => {
                    recipes.push(item.recipe);
                })
                setRecipeResponse({ ...res, results: recipes });
                setActive(pageClicked);
            }
        })()
    }, [queryParams, pageClicked]);

    const handleDeleteList = () => {
        (async () => {
            const response = await deleteList(dispatchDelete, listId, userData.user.token.key);
            if (response?.result === 'ok') {
                navigate(`/user/${userData.user.user.username}`);
            }
        })()
    }

    return (
        <Container>
            {list?.user?.username === userData.user.user.username &&
                <DropdownButton
                    variant={'danger'}
                    title={String.fromCharCode('8942')}
                    style={{ paddingTop: '0.5em' }}
                >
                    <Dropdown.Item onClick={() => setShowModal(true)}>
                        Delete List
                    </Dropdown.Item>
                </DropdownButton>

            }
            {
                list?.desc &&
                <Row style={{
                    margin: "auto",
                }}>
                    <h2 >{list.desc}</h2>
                </Row>
            }
            <Row>
                <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
            </Row>
            <Row>
                <Col>
                    <RecipeCards response={recipesResponse} />
                </Col>
            </Row>
            <PaginationBar response={recipesResponse} active={active} setPageClicked={setPageClicked} />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete List</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this list?
                    This action is not reversible</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteList()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >

    )
}