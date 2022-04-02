import React, { useState, useReducer, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

import ListPagination from './ListPagination';
import CreateList from './CreateList';
import { getUserLists } from '../../actions/ListActions';
import { GetUserListsReducer } from '../../reducers/ListReducer';
import { UserContext } from '../Context/authContext';

export default function RecipeList(props) {
    const [lists, setLists] = useState();
    const [response,setResponse] = useState();
    const [state, dispatch] = useReducer(GetUserListsReducer);
    const [clicked, setClicked] = useState();
    const userData = useContext(UserContext);

    useEffect(() => {
        async function getLists() {
            if (props?.user?.id && !clicked) {
                const response = await getUserLists(dispatch, props.user.id)
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
    }, [props?.user, clicked])

    return (
        <Container style={{paddingLeft:'0',paddingRight:'0'}}>
            <ListGroup>
                {userData.user?.user?.id === props?.user?.id &&
                    <CreateList lists={lists} setLists={setLists} userData={userData} dispatch={dispatch}/>
                }
                {lists &&
                    lists.map((list, index) => {
                        return (
                            <Container key={index} style={{ display: 'table-cell', paddingLeft: '0', paddingRight: '0' }}>
                                <ListGroup.Item action href={`${window.location.pathname}/list/${list.id}`} >
                                    {list.name}
                                </ListGroup.Item>
                            </Container>
                        )
                    })
                }
                {response &&
                    <ListPagination setClicked={setClicked} next={response?.next} previous={response?.previous} />
                }


            </ListGroup>
        </Container>
    )
}