import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { getListRecipes, getList, deleteList } from '../../actions/ListActions';
import { ListReducer } from '../../reducers/ListReducer';
import { UserContext } from '../Context/authContext';
import ListRecipeCards from './ListRecipeCards';
import PaginationBar from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';
import { useError } from '../ErrorHandler/ErrorHandler';

export default function List() {
    const userData = useContext(UserContext);
    const [stateList, dispatchList] = useReducer(ListReducer);
    const [recipesResponse, setRecipesResponse] = useState();
    const [list, setList] = useState();
    const { listId } = useParams();
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [rerender, setRerender] = useState(false);
    const { setError } = useError();

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (listId && !list) {
                const response = await getList(dispatchList, listId);
                if (response?.result) {
                    setList(response.result);
                }
            }
        })()
    }, [listId]);

    useEffect(() => {
        (async () => {
            if (list && !recipesResponse) {
                const res = await getListRecipes(dispatchList, listId, queryParams, pageClicked);
                if (res) {
                    const recipes = [];
                    res.results.forEach(item => {
                        recipes.push(item.recipe);
                    })
                    setRecipesResponse({ ...res, results: recipes });
                    setActive(pageClicked);
                }
            }
        })()
    }, [queryParams, pageClicked, rerender, list]);

    useEffect(() => {
        if (stateList?.errorMessage) {
            setError(stateList.errorMessage)
        }
    }, [stateList])

    const handleDeleteList = () => {
        (async () => {
            const response = await deleteList(dispatchList, listId, userData.user.token.key);
            if (response?.result === 'ok') {
                navigate(`/user/${userData.user.user.username}`);
            }
        })()
    }

    return (
        <Container>
            {userData?.user?.isAuth && list?.user?.username === userData?.user?.user?.username &&
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
            <Row style={{
                paddingLeft: '2%',
                paddingRight: '2%'
            }}>
                <ListRecipeCards state={stateList} setRecipesResponse={setRecipesResponse}
                    setRerender={setRerender} rerender={rerender} user={list?.user} dispatch={dispatchList} />
            </Row>
            <PaginationBar response={recipesResponse} active={active} setPageClicked={setPageClicked} />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this list?
                    This action is not reversible
                </Modal.Body>
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