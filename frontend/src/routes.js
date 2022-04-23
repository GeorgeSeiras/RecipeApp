import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Recipe from './components/Recipe/Recipe';
import User from './components/User/User';
import CreateRecipe from './components/CreateRecipe/CreateRecipe';
import EditUser from './components/EditUser/EditUser';
import List from './components/RecipeList/List';
import ContinueThread from './components/Comment/ContinueThread';
import {Library} from './components/MediaLibrary/Library'

export const privateRoutes = [
    {
        path: '/recipe/new',
        element: <CreateRecipe />
    },
    {
        path: '/user/:id/edit',
        element: <EditUser />
    },
    {
        path: '/user/library',
        element: <Library/>
    }
]

export const publicRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/recipe/:id',
        element: <Recipe />
    },
    {
        path: '/user/:username',
        element: <User />
    },
    {
        path: '/user/:userId/list/:listId',
        element: <List />
    },
    {
        path: 'recipe/:recipeId/comment/:commentId',
        element: <ContinueThread />
    }
]
export const authRoutes = [
    {

        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Signup />,

    },
]