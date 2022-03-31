import React, { useReducer, useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { getContinueThreadComments } from '../../actions/CommentActions';
import { RecipeCommentsReducer } from '../../reducers/CommentReducer';
import { UserContext } from '../Context/authContext';
import CommentsBody from './CommentsBody';
import useError from '../ErrorHandler/ErrorHandler';

export default function Comments() {
    const { commentId } = useParams();
    const [state, dispatch] = useReducer(RecipeCommentsReducer);
    const userData = useContext(UserContext);
    const [successAlert, setSuccessAlert] = useState(null);
    const { addError } = useError();

    useEffect(() => {
        (async () => {
            await getContinueThreadComments(dispatch, commentId);
        })();
    }, [])

    useEffect(() => {
        (async () => {
            if (state?.created) {
                await getContinueThreadComments(dispatch, commentId);
            }
        })()
    }, [state?.created])

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state])

    return (
        <Container>
            {successAlert &&
                <Alert variant={'success'} onClose={() => { setSuccessAlert(null) }} dismissible>
                    Comment Successfuly Created!
                </Alert>}
            <CommentsBody state={state} dispatch={dispatch} userData={userData} setSuccessAlert={setSuccessAlert}/>
        </Container>

    )
}