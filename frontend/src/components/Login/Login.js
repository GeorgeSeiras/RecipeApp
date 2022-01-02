import React, { useState, useReducer, useRef, useEffect, useContext } from 'react'
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'
import { userLogin, getMe } from './actions';
import { AuthReducer, GetMeReducer } from './reducer'
import { UserContext } from '../Context/authContext';
import "./Login.css";


function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(AuthReducer);
    const [stateGetMe, dispatchGetMe] = useReducer(GetMeReducer);
    const { login } = useContext(UserContext);

    const initialState = useRef(true);
    useEffect(() => {
        if (initialState.current) {
            initialState.current = false;
            return
        }
        if (state?.errorMessage) {
            setErrorMessage(state.errorMessage)
        }
    }, [state])

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        let payload = { username, password };
        try {
            let responseLogin = await userLogin(dispatch, payload, remember);
            if (!responseLogin?.access) {
                return;
            }
            let responseMe = await getMe(dispatchGetMe, responseLogin.access);
            if (!responseMe) {
                return;
            }
            await login({ user: responseMe.user, token: responseLogin.access })
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSumbit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="username"
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="remember">
                    <Form.Check
                        type="checkbox"
                        label="Remember Me"
                        onChange={(e) => setRemember(e.target.checked)}>
                    </Form.Check>
                </Form.Group>
                <Button variant="primary" size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
                {errorMessage &&
                    <h4 className="Error">{errorMessage}</h4>}
            </Form>
        </div>
    );

}

export default Login;