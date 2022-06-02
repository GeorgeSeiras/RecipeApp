import {React,useState,useReducer,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {passwordResetReducer} from '../../reducers/LoginReducer'
import {resetRequest} from '../../actions/LoginActions';
import useError from '../ErrorHandler/ErrorHandler';

export default function ForgotPassword(){
    const [email,setEmail] = useState('');
    const [successMessage,setSuccessMessage] = useState('');
    const [state,dispatch] = useReducer(passwordResetReducer);
    const {addError} = useError();

    const disabled = ()=>{
        return email === '';
    }

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state?.errorMessage])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const payload = {'email':email}
        const res = await resetRequest(dispatch,payload);
        if(res){
            setSuccessMessage(`Email sent to ${email}`)
        }
    }

    return(
        <Form onSubmit={handleSubmit} style={{ paddingTop:'10%',margin: '0 auto', maxWidth: '320px' }}>
            <Form.Label>Enter Your Account's Email</Form.Label>
            <Form.Group style={{marginBottom:'10px'}}>
                <Form.Control
                    placeholder='email'
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                />
            </Form.Group>
            <Button type='submit' disabled={!disabled}>
                {'Reset Password'}
            </Button>
            {successMessage !== ''&&
                <h4 style={{ color: 'green' }}>{successMessage}</h4>
            }
        </Form>
    )
}