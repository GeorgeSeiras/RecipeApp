import React, { useEffect, useReducer, useState } from 'react';
import { RecipesReducer } from './reducer';
import { getRecipes } from "./actions";
import RecipeCards from './RecipeCards';
import SearchBar from './SearchBar';
import PaginationBar from './Pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Home(props) {

    const [state, dispatch] = useReducer(RecipesReducer);
    const [queryParams, setQueryParams] = useState('');
    const [response, setResponse] = useState()
    const [active, setActive] = useState(1);
    const [pageClicked,setPageClicked] = useState(1);


    useEffect(() => {
        (async () => {
            const res = await getRecipes(dispatch, queryParams, pageClicked);
            if (res) {
                setResponse(res);
                    setActive(pageClicked);
            }
        })()
    }, [queryParams,pageClicked])

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
            <PaginationBar response={response} active={active} setPageClicked={setPageClicked}/>
        </Container>
    )
}