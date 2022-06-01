import React, { useEffect, useReducer, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import { RecipesReducer } from '../../reducers/RecipeReducer';
import { getRecipes } from "../../actions/RecipeActions";
import RecipeCards from './RecipeCards';
import SearchBar from './SearchBar';
import PaginationBar from './Pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useError from '../ErrorHandler/ErrorHandler';

export default function Home(props) {

    const [state, dispatch] = useReducer(RecipesReducer);
    const [queryParams, setQueryParams] = useState('');
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const {addError} = useError();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state?.errorMessage])

    useEffect(()=>{
        var params = `?page=${searchParams.get('page') ||active}`
        searchParams.forEach((value,key)=>{
            if(key !== 'page'){
                params = params.concat(`&${key}=${value}`);
            }
        })
        setQueryParams(params)
    },[searchParams])

    useEffect(()=>{
        const urlParams = new URLSearchParams(searchParams)
        urlParams.set('page',pageClicked)
        setSearchParams(urlParams.toString())
        setActive(pageClicked)
    },[pageClicked])

    useEffect(() => {
        (async () => {
            const res = await getRecipes(dispatch, queryParams ,setSearchParams);
        })()
    }, [queryParams])

    return (
        <Container>
            <Row>
                <SearchBar 
                title={searchParams.get('title')}
                username={searchParams.get('username')} 
                cuisine={searchParams.get('cuisine')}
                course={searchParams.get('course')}
                sort={searchParams.get('sort')}
                setQueryParams={setQueryParams} />
            </Row>
            {state?.recipes &&
                <Row style={{ paddingBottom: '1em' }}>
                    <Col>
                        <RecipeCards response={state?.recipes} />
                    </Col>
                </Row>
            }
            <PaginationBar response={state?.recipes} active={active} setPageClicked={setPageClicked} />

        </Container>
    )
}