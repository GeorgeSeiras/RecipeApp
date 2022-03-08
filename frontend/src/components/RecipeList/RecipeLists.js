import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup';

import ListPagination from './ListPagination';
import { getUserLists } from './actions';
import { GetUserListsReducer } from './reducer';
import { UserContext } from '../Context/authContext';

export default function RecipeList(props) {
    const [lists, setLists] = useState();
    const [state, dispatch] = useReducer(GetUserListsReducer);
    const [clicked, setClicked] = useState(0);
    const userData = useContext(UserContext);

    useEffect(() => {
        async function getLists() {
            if (props?.user?.id) {
                const response = await getUserLists(dispatch, props.user.id)
                if (response?.results) {
                    setLists(response.results)
                }
            }
        }
        getLists();
    }, [props?.user])

    useEffect(() => {
        (async () => {
            if (lists && clicked !== 0) {
                var url;
                switch (clicked) {
                    case 1:
                        url = lists.next;
                        return;
                    case -1:
                        url = lists.previous;
                }
                const response = await fetch(lists.next);
                if (response?.results) {
                    setLists(response.results)
                }
            }
        })()
    }, [clicked])

    return (
        <Container>
            <ListGroup>
                {userData.user?.user?.id === props?.user?.id &&
                    <ListGroup.Item variant='success'
                        action href={`${window.location.pathname}/list/new`}>
                        Create List
                    </ListGroup.Item>
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
                {lists &&
                    < ListPagination setClicked={setClicked} response={lists} />
                }


            </ListGroup>
        </Container>
    )
}