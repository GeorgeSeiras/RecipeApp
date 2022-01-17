import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Recipe from './components/Recipe/Recipe';
import User from './components/User/User';

export const privateRoutes = [

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
        path:'/user/:username',
        element:<User/>
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