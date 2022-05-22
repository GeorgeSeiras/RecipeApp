import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Recipe from './components/Recipe/Recipe';
import User from './components/User/User';
import CreateRecipe from './components/CreateRecipe/CreateRecipe';
import EditUser from './components/EditUser/EditUser';
import List from './components/RecipeList/List';
import ContinueThread from './components/Comment/ContinueThread';
import Reports from './components/Report/Reports'
import Report from './components/Report/Report';
import EmailVerification from './components/Signup/EmailVerificationNotification';
import VerifyEmail from './components/Signup/VerifyEmail';
import NewToken from './components/Signup/NewToken';

export const privateRoutes = [
    {
        path: '/recipe/new',
        element: <CreateRecipe />
    },
    {
        path: '/user/:id/edit',
        element: <EditUser />
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
    {
        path: '/verification',
        element: <EmailVerification />
    },
    {
        path: '/user/confirmation',
        element: <VerifyEmail />
    },
    {
        path: '/verification/new-token',
        element: <NewToken />
    }
]

export const adminRoutes = [
    {
        path: '/reports',
        element: <Reports />
    },
    {
        path: '/reports/:reportId',
        element: <Report />
    }
]