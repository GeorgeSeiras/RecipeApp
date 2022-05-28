import React, { useState, useReducer, useRef, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { userLogin, getMe, sociallogin } from '../../actions/LoginActions';
import { AuthReducer, GetMeReducer } from '../../reducers/LoginReducer'
import { UserContext } from '../Context/authContext';
import useError from '../ErrorHandler/ErrorHandler';

import { LoginSocialFacebook, LoginSocialGoogle } from 'reactjs-social-login';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

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
    const [rerender, setRerender] = useState(true)

    const [provider, setProvider] = useState('')
    const [profile, setProfile] = useState()
    const facebookRef = useRef(null)
    const googleRef = useRef(null)

    const onLoginStart = useCallback(() => {
    }, [])

    const onLogoutFailure = useCallback(() => {
        setRerender(false)
        setRerender(true)
    }, [rerender])

    const onLogoutSuccess = useCallback(() => {
        setProfile(null)
        setProvider('')
    }, [])

    const onLogout = useCallback(() => {
        switch (provider) {
            case 'facebook':
                facebookRef.current?.onLogout()
                break;
            case 'google':
                googleRef.current?.onLogout()
                break;
            default:
                break
        }
    }, [provider])

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
            grant_type: 'password',
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET
        };
        try {
            const responseLogin = await userLogin(dispatch, payload, remember);
            if (!responseLogin?.access_token) {
                return;
            }
            getMeAndRedirect(responseLogin.access_token)
        } catch (error) {
            console.log(error);
        }
    }

    const getMeAndRedirect = async (token) => {
        const responseMe = await getMe(dispatchGetMe, token);
        if (!responseMe) {
            return;
        }
        if (responseMe)
            if (responseMe?.user?.removed === true) {
                addError({ "message": 'Your account has been suspended by an administrator' })
            } else {
                await login({ user: responseMe.user, token: token })
                navigate('/')
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
            {rerender &&
                <>
                    <LoginSocialFacebook
                        ref={facebookRef}
                        appId={process.env.REACT_APP_FB_APP_ID || ''}
                        onLoginStart={onLoginStart}
                        onLogoutSuccess={onLogoutSuccess}
                        fieldsProfile={'id,name,picture,email'}
                        scope={'email,public_profile'}
                        onResolve={async ({ provider, data }) => {
                            try {
                                setProvider(provider)
                                setProfile(data)
                                const res = await sociallogin(dispatch, 'facebook', data.accessToken)
                                if (res) {
                                    getMeAndRedirect(res)
                                } else {
                                    onLogout()
                                    setErrorMessage('Something went wrong while connection with Facebook')
                                }
                            } catch (e) {
                                setRerender(false)
                                setRerender(true)
                                console.log(e)
                            }
                        }}
                        onReject={(err) => {
                            setRerender(false)
                            setRerender(true)
                            setErrorMessage('Something went wrong.')
                        }}
                    >
                        <FacebookLoginButton style={{ disabled: 'false' }} />
                    </LoginSocialFacebook>
                    <LoginSocialGoogle
                        ref={googleRef}
                        client_id={process.env.REACT_APP_GG_APP_ID || ''}
                        onLogoutFailure={onLogoutFailure}
                        onLoginStart={onLoginStart}
                        onLogoutSuccess={onLogoutSuccess}
                        onResolve={async ({ provider, data }) => {
                            try {
                                setProvider(provider)
                                setProfile(data)
                                const res = await sociallogin(dispatch, 'google-oauth2', data.access_token)
                                if (res) {
                                    getMeAndRedirect(res)
                                } else {
                                    onLogout()
                                    setErrorMessage('Something went wrong while connection with Google')
                                }
                            } catch (e) {
                                setRerender(false)
                                setRerender(true)
                                console.log(e)
                            }
                        }}
                        onReject={(err) => {
                            setRerender(false)
                            setRerender(true)
                            console.log(err)
                        }}
                    >
                        <GoogleLoginButton />
                    </LoginSocialGoogle>
                </>
            }
            {errorMessage &&
                <h4 style={{ color: 'red' }}>{errorMessage}</h4>
            }
        </form>
    );

}

export default Login;