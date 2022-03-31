import React, { useReducer, useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

import CreateComment from './CreateComment';
import { getRecipeComments } from '../../actions/CommentActions';
import { RecipeCommentsReducer } from '../../reducers/CommentReducer';
import { UserContext } from '../Context/authContext';
import CommentsBody from './CommentsBody';
import useError from '../ErrorHandler/ErrorHandler';

export default function Comments() {
    const { id } = useParams();
    const [state, dispatch] = useReducer(RecipeCommentsReducer);
    const userData = useContext(UserContext);
    const [successAlert, setSuccessAlert] = useState(null);
    const {addError} = useError();
    
    useEffect(() => {
        (async () => {
            await getRecipeComments(dispatch, id);
        })();
    }, [])

    useEffect(() => {
        (async () => {
            if (state?.created) {
                await getRecipeComments(dispatch, id);
            }
        })()
    }, [state?.created])

    useEffect(() => {
        if (state?.errorMessage) {
            addError(state.errorMessage)
        }
    }, [state?.errorMessage])

    return (
        <Container>
            {successAlert &&
                <Alert variant={'success'} onClose={() => { setSuccessAlert(null) }} dismissible>
                    Comment Successfuly Created!
                </Alert>}
            {userData?.user?.isAuth &&
                <CreateComment setSuccessAlert={setSuccessAlert} dispatch={dispatch} recipeId={id}/>
            }
            <CommentsBody state={state} dispatch={dispatch} userData={userData} setSuccessAlert={setSuccessAlert} />
        </Container>
    )
}