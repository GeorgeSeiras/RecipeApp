import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Recipe from './components/Recipe/Recipe';
import User from './components/User/User';
import CreateRecipe from './components/Recipe/CreateRecipe';

export const privateRoutes = [
    {
        path: '/recipe/new',
        element: <CreateRecipe/>
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