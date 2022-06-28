import React, { useEffect, useReducer, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import {useSearchParams} from 'react-router-dom';

import { RecipesReducer } from '../../reducers/RecipeReducer';
import { getRecipes } from '../../actions/RecipeActions';
import UserInfo from './UserInfo';
import RecipeCards from '../Home/RecipeCards';
import Pagination from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';
import RecipeLists from '../RecipeList/RecipeLists'
import { UserContext } from '../Context/authContext';
import { UserReducer } from '../../reducers/UserReducer'
import { getUser } from '../../actions/UserActions';
import useError from '../ErrorHandler/ErrorHandler';
import ReportButton from '../Report/CreateReportButton';

export default function User() {
    const [recipesState, recipesDispatch] = useReducer(RecipesReducer);
    const [userState, userDispatch] = useReducer(UserReducer);
    const { username } = useParams();
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState(1);
    const [queryParams, setQueryParams] = useState('');
    const navigate = useNavigate();
    const { addError } = useError();
    const [searchParams, setSearchParams] = useSearchParams();

    const userData = useContext(UserContext);

    useEffect(()=>{
        (async()=>{
            await getUser(userDispatch, username,userData?.user?.token?.key);  
        })()
    },[userData?.user?.user])

    useEffect(()=>{
        (async()=>{
            if(userData?.user?.user){
                var params = `?page=${searchParams.get('page') ||active}&username=${username}`
                searchParams.forEach((value,key)=>{
                    if(key !== 'page' && key!=='username'){
                        params = params.concat(`&${key}=${value}`);
                    }
                })
                setQueryParams(params)
            }
        })()
    },[searchParams,userData?.user?.user])

    useEffect(()=>{
        const urlParams = new URLSearchParams(searchParams)
        urlParams.set('page',pageClicked)
        setSearchParams(urlParams.toString())
        setActive(pageClicked)
    },[pageClicked])

    useEffect(() => {
        (async () => {
            await getRecipes(recipesDispatch, queryParams,setSearchParams);
        })();
    }, [queryParams])

    useEffect(() => {
        if (userState?.errorMessage) {
            addError(userState.errorMessage)
        }
    }, [userState]);

    return (
        <Container>
            {userState?.user &&
                <Container>
                    {userData?.user?.user && userData?.user?.user?.id !== userState?.user?.id &&
                        <Container style={{ textAlign: 'right' }}>
                            <ReportButton id={userState.user.id} userData={userData} type={'USER'} />
                        </Container>
                    }
                    <UserInfo user={userState?.user} />
                    {window.location.pathname.split('/').pop() === String(userData?.user?.user?.username) &&
                        <Button variant="success"
                            style={{ display: 'flex', margin: 'auto', width: '350px', justifyContent: 'center' }}
                            onClick={(e) => navigate('/recipe/new')}>
                            Create Recipe
                        </Button>}
                    <Row xs={'auto'}>
                        <Col style={{ width: '15%', paddingLeft: '0', paddingTop: '0.5em' }}>
                            <RecipeLists user={userState?.user} />
                        </Col>
                        <Col style={{ width: '85%', paddingLeft: '0', paddingRight: '0' }}>
                            <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} user={username} />
                            <RecipeCards response={recipesState?.recipes} />
                            {recipesState?.recipes &&
                                <div style={{marginTop:'5%'}}>
                                    <Pagination response={recipesState?.recipes} active={active} setPageClicked={setPageClicked} />
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    )
}