import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useSearchParams} from 'react-router-dom';

import { getList, deleteList } from '../../actions/ListActions';
import { getListRecipes, updateRecipesInList } from '../../actions/RecipesInListActions';
import { ListReducer } from '../../reducers/ListReducer';
import { RecipesInListReducer } from '../../reducers/RecipesInListReducer';
import { UserContext } from '../Context/authContext';
import ListRecipeCards from './ListRecipeCards';
import PaginationBar from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';
import useError from '../ErrorHandler/ErrorHandler';
import ReportButton from '../Report/CreateReportButton'

export default function List() {
    const [searchParams, setSearchParams] = useSearchParams();

    const userData = useContext(UserContext);
    const [stateList, dispatchList] = useReducer(ListReducer);
    const [stateRecipesList, dispatchRecipesList] = useReducer(RecipesInListReducer);
    const { listId } = useParams();
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(searchParams.get('page') || 1);
    const [pageClicked, setPageClicked] = useState(searchParams.get('page') || 1);
    const [showModal, setShowModal] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [response, setResponse] = useState(null)
    const { addError } = useError();

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (listId && !stateList?.list) {
                await getList(dispatchList, listId, userData?.user?.token?.key);
            }
        })()
    }, [listId]);

    useEffect(()=>{
        const urlParams = new URLSearchParams(searchParams)
        urlParams.set('page',pageClicked)
        setSearchParams(urlParams.toString())
        setActive(pageClicked)

        var params = `?page=${pageClicked}`
        searchParams.forEach((value,key)=>{
            if(key !== 'page'){
                    params = params.concat(`&${key}=${value}`);
            }
        })
        if(params !== queryParams){
            setQueryParams(params)
        }
    },[pageClicked])

    useEffect(() => {
        (async () => {
            if (stateList?.list) {
                const res = await getListRecipes(dispatchRecipesList, listId, queryParams, setSearchParams);
                setResponse(res)
                if (res) {
                    const recipes = [];
                    res.results.forEach(item => {
                        recipes.push(item.recipe);
                    })
                }
            }
        })()
    }, [queryParams, rerender, stateList?.list]);

    useEffect(() => {
        if (stateList?.errorMessage) {
            addError(stateList.errorMessage)
        }
    }, [stateList?.errorMessage])

    const handleDeleteList = () => {
        (async () => {
            const response = await deleteList(dispatchList, listId, userData.user.token.key);
            if (response?.result === 'ok') {
                navigate(`/user/${userData.user.user.username}`);
            }
        })()
    }

    return (
        <Container style={{ paddingBottom: '3em' }}>
            <Row>
                <Col>
                    {userData?.user?.isAuth && stateList?.list?.user?.username === userData?.user?.user?.username &&
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
                </Col>
                <Col style={{ textAlign: 'right', paddingTop: '10px' }}>
                    {userData?.user?.user && stateList?.list && userData?.user?.user?.id !== stateList?.list?.user?.id &&
                        <ReportButton id={stateList.list.id} userData={userData} type={'LIST'} />
                    }
                </Col>
            </Row>
            {
                stateList?.list?.desc &&
                <Row style={{
                    margin: "auto",
                }}>
                    <h2 >{stateList?.list.desc}</h2>
                </Row>
            }
            <Row>
                <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
            </Row>
            <Row style={{
                paddingLeft: '2%',
                paddingRight: '2%',
                paddingBottom: '1em'
            }}>
                <ListRecipeCards state={stateRecipesList}
                    setRerender={setRerender} rerender={rerender} user={stateList?.list?.user} dispatch={dispatchRecipesList} />
            </Row>
            {response &&
                <PaginationBar response={response} active={active} setPageClicked={setPageClicked} />
            }
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