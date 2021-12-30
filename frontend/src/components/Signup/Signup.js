import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [genericError, setGenericError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [success, setSuccess] = useState("");
    function validateForm() {
        return username.length > 0
            && password.length > 0
            && password2.length > 0
            && email.length > 0;
    }

    function checkPassword() {
        if (password.length < 8) {
            setPasswordError("Password must be atleast 8 characters long")
            return false;
        }
        if (password !== password2) {
            setPasswordError("Passwords must match")
            return false;
        }
        return true;
    }

    function handleSumbit(event) {
        event.preventDefault();
        setGenericError("");
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        if (checkPassword()) {
            registerUser(username, email, password)
        }
        setSuccess(true);
        return;
    }

    return (
        <div className="Signup">
            <Form onSubmit={handleSumbit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <h4 className="Error">{emailError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameError && <h4 className="Error">{usernameError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <h4 className="Error">{passwordError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="password2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password2}
                        placeholder="Enter Password Again"
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" size="lg" disabled={!validateForm()}>
                    Register
                </Button>
                {genericError &&
                    <h4 className="Error">{genericError}</h4>}
            </Form>
            {success &&
                <Navigate to='../login'/>}
        </div>
    );

    async function registerUser(username, email, password) {
        try {
            const data = {
                "username": username,
                "email": email,
                "password": password
            }
            const response = await fetch('http://localhost:8000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw response;
            } else {
                return await response.json()

            }
        } catch (error) {
            const errorJson = JSON.parse(await error.text())
            if (error.status === 400) {
                if (errorJson?.email) {
                    setEmailError("Email already exists");
                }
                if (errorJson?.username) {
                    setUsernameError("Username already exists");
                }
            } else {
                setGenericError("Something went wrong");
            }
        }
    }
}
