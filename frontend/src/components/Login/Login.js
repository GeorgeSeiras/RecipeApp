import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import { Navigate, useNavigate } from 'react-router-dom'
import { login, useAuthState, useAuthDispatch } from '../Context';

import "./Login.css";


function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState("");
    const navigate = useNavigate();

    const dispatch = useAuthDispatch();
    const { loading, errorMessage } = useAuthState();

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        let payload = { username, password };
        try {
            let response = await login(dispatch, payload);
            if (!response.access) {
                return;
            }
            navigate('/home');
        } catch (error) {
            console.log(error)
        }
        // const token = await loginUser({
        //     username,
        //     password
        // });
        // setToken(token, remember)
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