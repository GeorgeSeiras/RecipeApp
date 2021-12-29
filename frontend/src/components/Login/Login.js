import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'

import "./Login.css";

async function loginUser(credentials) {
    return fetch('http://localhost:8000/api/token/', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(credentials)
    }).then(data=>data.json())
}

export default function Login({setToken}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState("");

    

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSumbit(e) {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token,remember)
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
            </Form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}