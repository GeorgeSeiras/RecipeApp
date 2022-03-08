import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getList } from './actions';
import { GetListReducer } from './reducer';
import { UserContext } from '../Context/authContext';
import RecipeCards from '../Home/RecipeCards';
import PaginationBar from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';

export default function List() {
    const userData = useContext(UserContext);
    const [state, dispatch] = useReducer(GetListReducer);
    const [response, setResponse] = useState();
    const { listId } = useParams();
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);

    useEffect(() => {
        async function getListApiCall() {
            const res = await getList(dispatch, listId, userData.user.token.key, queryParams, pageClicked);
            if (res) {
                const recipes = [];
                res.results.forEach(item => {
                    recipes.push(item.recipe);
                })
                setResponse({ ...res, results: recipes });
                setActive(pageClicked);
            }
        }
        getListApiCall();
    }, [queryParams, pageClicked])

    return (
        <Container>
            <Row>
                <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
            </Row>
            <Row>
                <Col>
                    <RecipeCards response={response} />
                </Col>
            </Row>
            <PaginationBar response={response} active={active} setPageClicked={setPageClicked} />
        </Container>
    )
}