import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';

export const privateRoutes = [
    {
        path: '/home',
        element: <Home />
    }
]

export const publicRoutes = [
  
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