import React, { useState, useContext, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../Context/authContext';
import UploadImageCard from '../CreateRecipe/UploadImageCard';
import { ChangePasswordReducer, EditUserReducer } from './reducer'
import { changePassword, editUser } from './actions';

export default function UserInfo() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState(null)
    const [curPassword, setCurPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null)
    const userData  = useContext(UserContext);
    const [passwordState, passwordDispatch] = useReducer(ChangePasswordReducer);
    const [editUserState, editUserDispatch] = useReducer(EditUserReducer);

    function checkPassword() {
        setPasswordError(null)
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (image != null) {

        }
        const payload = []
        if (email !== '') {
            payload.push({ 'email': email });
        }
        if (username !== '') {
            payload.push({ 'username': username })
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordSuccess(null)
        if (checkPassword()) {
            const payload = {
                'password': curPassword,
                'newPassword1': password,
                'newPassword2': password2
            }
            const passwordResponse = await changePassword(passwordDispatch,payload,userData.user.token.key);
            if( passwordResponse?.result){
                setPasswordSuccess('Password successfuly changed')
            }
        }

    }

    const validatePasswordForm = () => {
        if (curPassword === '' || password === '' || password2 === '') {
            return false;
        }
        return true;
    }

    return (
        <Container>
            <Form onSubmit={(e) => handleSubmit(e)} style={{ paddingTop: '1em' }}>
                <UploadImageCard images={image} setImages={setImage} type={'single'}/>
                <Form.Group className='mb-3' style={{ paddingTop: '1em' }}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='text'
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
            </Form >
            <Form onSubmit={(e) => { handlePasswordSubmit(e) }}>
                <Form.Group className='mb-3'>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={curPassword}
                        placeholder='Current Password'
                        onChange={(e) => setCurPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        placeholder='New Password'
                        onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password2}
                        placeholder='Repeat Password'
                        onChange={(e) => setPassword2(e.target.value)} />
                </Form.Group>
                {passwordError && <h4 className="Error">{passwordError}</h4>}
                {passwordSuccess && <h4 className="text-success">{passwordSuccess}</h4>}
                <Button type='submit' disabled={!validatePasswordForm()}>
                    Change Password
                </Button>
            </Form>
        </Container >
    )
}