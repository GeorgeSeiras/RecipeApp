import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { UserReducer } from './reducer';
import { RecipesReducer } from '../Home/reducer';
import { getUser } from './actions'
import { getRecipes } from '../Home/actions';
import UserInfo from './UserInfo';
import RecipeCards from '../Home/RecipeCards';
import Pagination from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';

export default function User() {
    const [state, dispatch] = useReducer(UserReducer);
    const [recipesState, recipesDispatch] = useReducer(RecipesReducer)
    const { username } = useParams();
    const [user, setUser] = useState();
    const [recipes, setRecipes] = useState();
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState();
    const [queryParams, setQueryParams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const payload = {
                'username': username
            }
            const response = await getUser(dispatch, payload)
            if (response?.result) {
                setUser(response.result)
            }
            const recipesResponse = await getRecipes(recipesDispatch, [`?username=${username}`], pageClicked)
            if (recipesResponse?.result) {
                setRecipes(recipesResponse)
            }
        })();
    }, [])

    useEffect(() => {
        (async () => {
            var recipesResponse;
            if (queryParams.length === 0) {
                recipesResponse = await getRecipes(recipesDispatch, queryParams, pageClicked)
            } else {
                recipesResponse = await getRecipes(recipesDispatch, queryParams, pageClicked)
            }
            if (recipesResponse) {
                if(pageClicked){
                    setActive(pageClicked)
                }
                setRecipes(recipesResponse)
            }
        })();
    }, [queryParams, pageClicked])

    return (
        <div>
            <UserInfo user={user} />
            {user?.username === window.location.pathname.split('/').pop() &&
                <Button variant="success"
                    style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                    onClick={(e) => navigate('/recipe/new')}>
                    Create Recipe
                </Button>}
            <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} username={username} />
            <RecipeCards response={recipes} />
            <Pagination response={recipes} active={active} setPageClicked={setPageClicked} />
        </div>
    )
}