import React, { useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert';

import useError from '../ErrorHandler/ErrorHandler';
import { newToken } from '../../actions/VerificationActions';
import { VerificationReducer } from '../../reducers/VerificationReducer';

export default function NewToken() {
    const [state, dispatch] = useReducer(VerificationReducer);
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { addError } = useError();

    const disabled = () => {
        if (email === '') {
            return false;
        }
        return true;
    }
    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage);
        }
    }, [state?.errorMessage])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccessMessage('');
        const payload = { 'email': email };
        const res = await newToken(dispatch, payload);
        if(res?.result === 'ok'){
            setSuccessMessage(`Verification email has been sent to ${email}`)
        }
    }

    return (
        <div style={{ margin: '0 auto', paddingTop: '50px', maxWidth: '520px' }}>
            {successMessage !== '' &&
                <Alert variant='success' dismissible>
                    {successMessage}
                </Alert>
            }
            <h1>Send a new account verification email</h1>
            <Form onSubmit={handleSubmit} className="mb-3">
                <Form.Group >
                    <Form.Label >Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Button type='submit' variant='primary' disabled={!disabled()} style={{ marginTop: '10px' }}>
                    Send Email
                </Button>
            </Form>
        </div>
    )
}