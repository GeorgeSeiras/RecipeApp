import React, { useState, useEffect, useReducer, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';

import { getUserLists } from '../../actions/ListActions';
import { getListsWithRecipe, addRecipeToList } from './actions';
import { GetUserListsReducer } from '../../reducers/ListReducer';
import { ListsWithRecipeReducer, addRecipeToListReducer } from './reducer';
import ListPagination from '../RecipeList/ListPagination';

import { UserContext } from '../Context/authContext';

export default function AddToList(props) {
    const [lists, setLists] = useState();
    const [listsWithRecipe, setListsWithRecipe] = useState();
    const [response, setResponse] = useState();
    const [show, setShow] = useState(false);
    const [state, dispatch] = useReducer(GetUserListsReducer);
    const [stateListsWithRecipe, dispatchListsWithRecipe] = useReducer(ListsWithRecipeReducer);
    const [stateAddRecipeToList, dispatchAddRecipeToList] = useReducer(addRecipeToListReducer);
    const [clicked, setClicked] = useState();
    const userData = useContext(UserContext);

    useEffect(() => {
        async function getLists() {
            if (userData?.user?.user?.id && !clicked) {
                const response = await getUserLists(dispatch, userData.user.user.id)
                if (response?.results) {
                    setLists(response?.results);
                    setResponse(response)
                }
            } else if (clicked !== 0) {
                if (clicked) {
                    const response = await fetch(clicked);
                    let data = await response.json();
                    if (data?.results) {
                        setLists(data?.results);
                        setResponse(data);
                    }
                }
            }
        }
        getLists();
    }, [userData?.user?.user, clicked])

    useEffect(() => {
        (async () => {
            if (userData?.user?.token && props?.recipe) {
                const response = await getListsWithRecipe(dispatchListsWithRecipe, userData.user.token.key, props.recipe.id);
                if (response?.result) {
                    setListsWithRecipe(response.result);
                }
            }
        })()
    }, [userData?.user?.token?.key, props?.recipe])

    const disabledCheck = (listId) => {
        if (!listsWithRecipe) {
            return true
        } else {
            return !listsWithRecipe.includes(listId)
        }
    }

    const handleClick = (e) => {
        (async () => {
            const response = await addRecipeToList(
                dispatchAddRecipeToList, userData.user.token.key, lists[e.target.parentNode.id].id, props.recipe.id);
            if (response?.result) {
                setListsWithRecipe(listsWithRecipe => [...listsWithRecipe, lists[e.target.parentNode.id].id])
                setShow(true);
            }
        })()
    }

    return (
        <Row xs='auto'>
            
            <Col>
                <DropdownButton
                    variant={'success'}
                    title={'Add To List'}
                    size='sm'
                    style={{ alignText: 'center' }}
                >
                    {lists && userData?.user?.user &&
                        lists.map((list, index) => {
                            return (
                                <Dropdown.Item key={index} id={index} style={{
                                    marginTop: '-0.8em',
                                    marginBottom: '-0.3em',
                                    paddingRight: '0',
                                    paddingLeft: '0'
                                }}>
                                    <ListGroup.Item action onClick={(e) => handleClick(e)} disabled={!disabledCheck(list.id)}>
                                        {list.name}
                                    </ListGroup.Item>
                                </Dropdown.Item>
                            )
                        })
                    }
                    {response &&
                        <ListPagination setClicked={setClicked} next={response?.next} previous={response?.previous} />
                    }
                </DropdownButton>
            </Col>
            <Row>
                <Alert show={show} variant="success" dismissible onClick={() => setShow(false)}>
                    <Alert.Heading>Recipe successfuly added to list!</Alert.Heading>

                </Alert>
            </Row>
        </Row>
    )
}