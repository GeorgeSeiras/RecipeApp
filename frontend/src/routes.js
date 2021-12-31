import  Login  from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';

const routes = [
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <Signup/>
    },
    {
        path: '/home',
        element: <Home/>,
        isPrivate: true
    }
]

export default routes