import React, { useState, useEffect, useReducer, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';

import { getUserLists, getListsWithRecipe, addRecipeToList } from '../../actions/ListActions';
import { GetUserListsReducer } from '../../reducers/ListReducer';
import ListPagination from '../RecipeList/ListPagination';

import { UserContext } from '../Context/authContext';
import useError from '../ErrorHandler/ErrorHandler';

export default function AddToList(props) {
    const [show, setShow] = useState(false);
    const [state, dispatch] = useReducer(GetUserListsReducer);
    const [clicked, setClicked] = useState();
    const userData = useContext(UserContext);
    const {addError} = useError();

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state?.errorMessage])
    
    useEffect(() => {
        async function getLists() {
            if (userData?.user?.user?.id && !clicked) {
                await getUserLists(dispatch, userData.user.user.id)

            } else if (clicked !== 0) {
                if (clicked) {
                    await fetch(clicked);
                }
            }
        }
        getLists();
    }, [userData?.user?.user, clicked])

    useEffect(() => {
        (async () => {
            if (userData?.user?.token && props?.recipe) {
                await getListsWithRecipe(dispatch, userData.user.token.key, props.recipe.id);
            }
        })()
    }, [userData?.user?.token?.key, props?.recipe])

    const disabledCheck = (listId) => {
        if (!state?.listsWithRecipe) {
            return true
        } else {
            return !state?.listsWithRecipe.includes(listId)
        }
    }

    const handleClick = (e) => {
        (async () => {
            await addRecipeToList(
                dispatch, userData.user.token.key, state?.lists?.results[e.target.parentNode.id].id, props.recipe.id);
            setShow(true);
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
                    {state?.lists?.results && userData?.user?.user &&
                        state?.lists?.results.map((list, index) => {
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
                    {state?.lists &&
                        <ListPagination setClicked={setClicked} next={state?.lists?.next} previous={state?.lists?.previous} />
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