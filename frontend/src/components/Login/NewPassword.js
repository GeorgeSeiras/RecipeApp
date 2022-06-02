import {React,useState,useReducer,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

import {passwordResetReducer} from '../../reducers/LoginReducer'
import {resetPassword} from '../../actions/LoginActions';
import useError from '../ErrorHandler/ErrorHandler';

export default function NewPassword(){
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const { token } = useParams();
    const [passwordError, setPasswordError] = useState("");
    const [state,dispatch] = useReducer(passwordResetReducer);
    const navigate = useNavigate();
    const {addError} = useError();

    function disabled() {
        return pass1.length > 0
            && pass2.length > 0;
    }

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state?.errorMessage])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setPasswordError('');
        if(checkPassword()){
            const payload = {
                'token':token,
                'password':pass1
            }
            const res = await resetPassword(dispatch,payload);
            if(res){
                navigate('/login')
            }
        }
    }

    function checkPassword() {
        if (pass1.length < 8) {
            setPasswordError("Password must be atleast 8 characters long")
            return false;
        }
        if (pass1 !== pass2) {
            setPasswordError("Passwords must match")
            return false;
        }
        return true;
    }

    return(
        <Form onSubmit={handleSubmit} style={{ paddingTop:'10%',margin: '0 auto', maxWidth: '320px' }}>
            {passwordError && <h4 style={{ color: 'red' }}>{passwordError}</h4>}
            <Form.Label>New Password</Form.Label>
            <Form.Group>
                <Form.Control
                    type='password'
                    placeholder='Password'
                    value={pass1}
                    onChange={(e)=>{setPass1(e.target.value)}}
                />
            </Form.Group>
            <Form.Label>Repeat The New Password</Form.Label>
            <Form.Group style={{marginBottom:'10px'}}>
                <Form.Control
                    type='password'
                    placeholder='Password'
                    value={pass2}
                    onChange={(e)=>{setPass2(e.target.value)}}
                />
            </Form.Group>
            <Button type='submit' disabled={!disabled}>
                {'Reset Password'}
            </Button>
        </Form>
       

    )
}