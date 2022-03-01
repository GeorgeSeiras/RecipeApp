import React, { useState, useContext, useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert'
import STAR_FIRST_HALF_EMPTY from '../../static/STAR_FIRST_HALF_EMPTY.jpg';
import STAR_SECOND_HALF_EMPTY from '../../static/STAR_SECOND_HALF_EMPTY.jpg';
import STAR_FIRST_HALF_FULL from '../../static/STAR_FIRST_HALF_FULL.jpg';
import STAR_SECOND_HALF_FULL from '../../static/STAR_SECOND_HALF_FULL.jpg';

import { UserContext } from '../Context/authContext';
import { rateRecipe, getUserRecipeRating } from './actions';
import { RateRecipeReducer, UserRecipeRatingReducer } from './reducer';

export default function RateableStars(props) {
    const [ratingToRender, setRatingToRender] = useState(0)
    const [userRating,setUserRating] = useState(null)
    const userData = useContext(UserContext);
    const [state, dispatch] = useReducer(RateRecipeReducer);
    const [stateUserRating, dispatchUserRating] = useReducer(UserRecipeRatingReducer);
    const { id } = useParams();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        async function getUserRating() {
            const response = await getUserRecipeRating(dispatchUserRating, userData.user.token.key, id);
            if(response?.result){
                setUserRating(response.result.rating)
                setRatingToRender(response.result.rating)
            }else{
                setRatingToRender(props?.rating)
            }
        }
        getUserRating();
    }, [])

    function getStar(star, key) {
        return (
            <Image
                style={{ paddingLeft: '0', paddingRight: '0' }}
                key={key} id={key}
                style={{ width: '0.75em', height: 'auto' }}
                src={star}
                alt=''
                onClick={(e) => handleClick(e)}
                onMouseOver={(e) => onMouseOver(e)}
                onMouseOut={(e) => onMouseOut(e)}
            />
        )
    }

    const onMouseOver = (e) => {
        setRatingToRender(e.target.id)
    }

    const onMouseOut = (e) => {
        setRatingToRender(userRating || props?.rating)
    }

    const handleClick = async (e) => {
        setAlert();
        const payload = { 'rating': e.target.id }
        const response = await rateRecipe(dispatch, payload, userData.user.token.key, id);
        if (response?.result) {
            props.setRecipe(response?.result.recipe);
            setAlert(true)
        }
    }

    const renderStars = (rating) => {
        const stars = []
        var key = 0
        if (rating === null || rating === undefined) {
            for (var i = 1; i <= 5; i++) {
                stars.push(getStar(STAR_FIRST_HALF_EMPTY, key += 0.5));
                stars.push(getStar(STAR_SECOND_HALF_EMPTY, key += 0.5));
            }
            return stars
        } else {
            for (i = 1; i <= 5; i++) {
                if (i > rating && parseFloat(i) - 0.5 <= rating) {
                    stars.push(getStar(STAR_FIRST_HALF_FULL, key += 0.5));
                    stars.push(getStar(STAR_SECOND_HALF_EMPTY, key += 0.5));
                } else if (i > rating) {
                    stars.push(getStar(STAR_FIRST_HALF_EMPTY, key += 0.5));
                    stars.push(getStar(STAR_SECOND_HALF_EMPTY, key += 0.5));
                } else {
                    stars.push(getStar(STAR_FIRST_HALF_FULL, key += 0.5));
                    stars.push(getStar(STAR_SECOND_HALF_FULL, key += 0.5));
                }
            }
        }
        return stars
    }

    return (
        <Container>
            <Col style={{
                fontSize: props.size,
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '0.4em'
            }}>
                {renderStars(ratingToRender)}
                ({(() => {
                    if (props?.rating) {
                        return (parseFloat(props.rating).toFixed(1))
                    } else {
                        return (0)
                    }
                })()})
                votes: {props.votes || 0}
            </Col>
            {alert &&
                <Alert variant={'success'} onClose={() => { setAlert(null) }} dismissible
                    style={{ textAlign: 'center' }}>
                    Rating Submited!
                </Alert>}
        </Container>
    )
}