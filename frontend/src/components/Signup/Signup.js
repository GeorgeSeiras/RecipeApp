import React, { useState, useReducer, useEffect, useRef } from "react";
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { register } from '../../actions/RegisterActions';
import { SignupReducer } from '../../reducers/RegisterReducer';


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
    const [state, dispatch] = useReducer(SignupReducer);

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

    const initialState = useRef(true);
    useEffect(() => {
        if (initialState.current) {
            initialState.current = false;
            return
        }
        if (state?.errorMessage) {
            if (state.errorMessage?.email) {
                setEmailError(state.errorMessage.email);
            }
            if (state.errorMessage?.username) {
                setUsernameError(state.errorMessage.username);
            }
        }
    }, [state])

    const handleSumbit = async (event) => {
        event.preventDefault();
        setGenericError("");
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        if (checkPassword()) {
            const payload = {
                "username": username,
                "email": email,
                "password": password
            }
            const response = await register(dispatch, payload);
            if (response) {
                setSuccess(true);
            }
            return;
        }
    }

    return (
        <div className="Signup" style={{ padding: '60px 0' }}>
            <Form onSubmit={handleSumbit} style={{ margin: '0 auto', maxWidth: '320px' }}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <h4 style={{ color: 'red' }}>{emailError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameError && <h4 style={{ color: 'red' }}>{usernameError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <h4 style={{ color: 'red' }}>{passwordError}</h4>}
                </Form.Group>
                <Form.Group size="lg" controlId="password2" style={{ paddingBottom: '0.5em' }}>
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
                    <h4 style={{ color: 'red' }}>{genericError}</h4>}
            </Form>
            {success &&
                <Navigate to='../login' />}
        </div>
    );
}
