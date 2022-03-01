import React, { useEffect, useReducer, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { RecipesReducer } from '../Home/reducer';
import { getRecipes } from '../Home/actions';
import UserInfo from './UserInfo';
import RecipeCards from '../Home/RecipeCards';
import Pagination from '../Home/Pagination';
import SearchBar from '../Home/SearchBar';
import { UserContext } from '../Context/authContext';

export default function User() {
    const [recipesState, recipesDispatch] = useReducer(RecipesReducer)
    const { username } = useParams();
    const [recipes, setRecipes] = useState();
    const [active, setActive] = useState(1);
    const [pageClicked, setPageClicked] = useState();
    const [queryParams, setQueryParams] = useState('');
    const navigate = useNavigate();

    const userData = useContext(UserContext);

    useEffect(() => {
        (async () => {
            if (userData?.user?.user) {
                var query = queryParams
                if(query === ''){
                    query = `?username=${userData.user.user.username}`
                }else{
                    query.concat = `&username=${userData.user.user.username}`
                }
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

    return (
        <div>
            <UserInfo user={userData.user.user} />
            {window.location.pathname.split('/').pop() === String(userData?.user?.user?.id) &&
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