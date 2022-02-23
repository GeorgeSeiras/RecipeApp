import React, { useState, useContext, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../Context/authContext';
import UploadImageCard from '../CreateRecipe/UploadImageCard';
import { ChangePasswordReducer, EditUserReducer, ChangeImageReducer } from './reducer'
import { changePassword, editUser, changeImage } from './actions';

export default function UserInfo() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState(null)
    const [curPassword, setCurPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [emailSuccess, setEmailSuccess] = useState(null);
    const [usernameSuccess, setUsernameSuccess] = useState(null);
    const [imageSuccess, setImageSuccess] = useState(null);

    const userData = useContext(UserContext);
    const [passwordState, passwordDispatch] = useReducer(ChangePasswordReducer);
    const [editUserState, editUserDispatch] = useReducer(EditUserReducer);
    const [imageState, editImageDispatch] = useReducer(ChangeImageReducer);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameSuccess(null);
        setEmailSuccess(null);
        setImageSuccess(null);
        if (image != null) {
            const formData = new FormData()
            formData.append('image', image);
            const response = await changeImage(editImageDispatch, formData, userData.user.token.key);
            if (response?.result) {
                setImageSuccess('Profile picture successfuly changed')
            }
        }
        if (email !== '' || username !== '') {
            const payload = new Map()
            if (email !== '') {
                payload.set('email', email );
            }
            if (username !== '') {
                payload.set( 'username', username )
            }
            const response = await editUser(editUserDispatch, Object.fromEntries(payload), userData.user.token.key);
            if (response?.result) {
                if (username !== '') {
                    setUsernameSuccess('Username successfuly changed');
                }
                if (email !== '') {
                    setEmailSuccess('Email successfuly changed');
                }
            }
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
            const passwordResponse = await changePassword(passwordDispatch, payload, userData.user.token.key);
            if (passwordResponse?.result) {
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

    const validateUserForm = () => {
        if (image === null && email === '' && username === '') {
            return false;
        }
        return true;
    }

    return (
        <Container>
            <Form onSubmit={(e) => handleSubmit(e)} style={{ paddingTop: '1em' }}>
                <UploadImageCard images={image} setImages={setImage} type={'single'} />
                {imageSuccess && <h4 className="text-success">{imageSuccess}</h4>}
                <Form.Group className='mb-3' style={{ paddingTop: '1em' }}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                {usernameSuccess && <h4 className="text-success">{usernameSuccess}</h4>}
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='text'
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                {emailSuccess && <h4 className="text-success">{emailSuccess}</h4>}
                <Button type='submit' disabled={!validateUserForm()} className='mb-3'>
                    Edit User
                </Button>
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