import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getListRecipes, getList } from './actions';
import { GetListRecipesReducer, GetListReducer } from './reducer';
import { UserContext } from '../Context/authContext';
import RecipeCards from '../Home/RecipeCards';
import PaginationBar from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';

export default function List() {
    const userData = useContext(UserContext);
    const [state, dispatch] = useReducer(GetListRecipesReducer);
    const [stateList, dispatchList] = useReducer(GetListReducer);
    const [recipesResponse, setRecipeResponse] = useState();
    const [list, setList] = useState();
    const { listId } = useParams();
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);

    useEffect(() => {
        (async () => {
            const response = await getList(dispatchList, listId);
            if (response?.result) {
                setList(response.result);
            }
        })()
    }, []);

    useEffect(() => {
        async function getListRecipesApiCall() {
            const res = await getListRecipes(dispatch, listId, userData.user.token.key, queryParams, pageClicked);
            if (res) {
                const recipes = [];
                res.results.forEach(item => {
                    recipes.push(item.recipe);
                })
                setRecipeResponse({ ...res, results: recipes });
                setActive(pageClicked);
            }
        }
        getListRecipesApiCall();
    }, [queryParams, pageClicked]);

    return (
        <Container>
            {list?.desc &&
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
        </Container>
    )
}