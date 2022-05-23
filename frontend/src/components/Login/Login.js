import React, { useState, useReducer, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userLogin, getMe } from '../../actions/LoginActions';
import { AuthReducer, GetMeReducer } from '../../reducers/LoginReducer'
import { UserContext } from '../Context/authContext';
import useError from '../ErrorHandler/ErrorHandler';

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(AuthReducer);
    const [stateGetMe, dispatchGetMe] = useReducer(GetMeReducer);
    const { login } = useContext(UserContext);
    const { addError } = useError();
    const initialState = useRef(true)

    useEffect(() => {
        if (initialState.current) {
            initialState.current = false;
            return
        }
        if (state?.errorMessage) {
            setErrorMessage(String(state.errorMessage))
        }
    }, [state])

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }
    const handleSumbit = async (e) => {
        e.preventDefault();
        const payload = {
            username,
            password,
            grant_type:'password',
            client_id:process.env.REACT_APP_CLIENT_ID,
            client_secret:process.env.REACT_APP_CLIENT_SECRET
        };
        try {
            const responseLogin = await userLogin(dispatch, payload, remember);
            if (!responseLogin?.access_token) {
                return;
            }
            const responseMe = await getMe(dispatchGetMe, responseLogin.access_token);
            if (!responseMe) {
                return;
            }
            if (responseMe)
                if (responseMe?.user?.removed === true) {
                    addError({ "message": 'Your account has been suspended by an administrator' })
                } else {
                    await login({ user: responseMe.user, token: responseLogin.access_token })
                }
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="Login" onSubmit={handleSumbit} style={{
            padding: '60px 0',
            margin: '0 auto',
            maxWidth: '320px'
        }}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                    className="form-control"
                    id="username"
                    autoFocus
                    type="username"
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    className="form-control"
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form-check" style={{ paddingTop: '0.3em' }}>
                    <input className="form-check-input"
                        id="rememberMe"
                        type="checkbox"
                        onChange={(e) => setRemember(e.target.checked)} />
                    <label className="form-check-label" htmlFor="rememberMe">
                        RememberMe
                    </label>
                </div>
                <a href='/verification/new-token' style={{ fontSize: '15px' }}>
                    Resend verification email
                </a>
            </div>

            <button type="submit" className="btn-lg btn-primary" disabled={!validateForm()}>
                Login
            </button>
            {errorMessage &&
                <h4 style={{ color: 'red' }}>{errorMessage}</h4>
            }
        </form>
    );

}

export default Login;