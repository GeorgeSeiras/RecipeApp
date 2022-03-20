import React, { useEffect, useReducer, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { RecipesReducer } from '../Home/reducer';
import { getRecipes } from '../Home/actions';
import UserInfo from './UserInfo';
import RecipeCards from '../Home/RecipeCards';
import Pagination from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';
import RecipeLists from '../RecipeList/RecipeLists'
import { UserContext } from '../Context/authContext';
import { GetUserReducer } from './reducer';
import { getUser } from './actions';
import { useError } from '../ErrorHandler/ErrorHandler';

export default function User() {
    const [recipesState, recipesDispatch] = useReducer(RecipesReducer);
    const [userState, userDispatch] = useReducer(GetUserReducer);
    const { username } = useParams();
    const [user, setUser] = useState();
    const [recipes, setRecipes] = useState();
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState();
    const [queryParams, setQueryParams] = useState('');
    const navigate = useNavigate();
    const { setError } = useError();

    const userData = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const userResponse = await getUser(userDispatch, username);
            if (userResponse?.result) {
                setUser(userResponse.result);
            }
            var query = queryParams
            if (query === '') {
                query = `?username=${username}`
            } else {
                query.concat = `&username=${username}`

                const recipesResponse = await getRecipes(recipesDispatch, query, pageClicked);
                if (recipesResponse) {
                    if (pageClicked) {
                        setActive(pageClicked);
                    }
                    setRecipes(recipesResponse);
                }
            }
        })();
    }, [queryParams, pageClicked, userData?.user?.user])

    useEffect(() => {
        if (userState?.errorMessage) {
            setError(userState.errorMessage)
        }
    }, [userState]);

    return (
        <div>
            <UserInfo user={user} />
            {window.location.pathname.split('/').pop() === String(userData?.user?.user?.username) &&
                <Button variant="success"
                    style={{ display: 'flex', margin: 'auto', width: '350px', justifyContent: 'center' }}
                    onClick={(e) => navigate('/recipe/new')}>
                    Create Recipe
                </Button>}
            <Row xs='auto' style={{ margin: 'auto' }}>
                <Col style={{ width: '20%', paddingTop: '0.5em' }}>
                    <RecipeLists user={user} />
                </Col>
                <Col style={{ width: '80%' }}>
                    <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} username={username} />
                    <RecipeCards response={recipes} />
                    {recipes?.length > 0 &&
                        <Pagination response={recipes} active={active} setPageClicked={setPageClicked} />
                    }
                </Col>
            </Row>
        </div>
    )
}