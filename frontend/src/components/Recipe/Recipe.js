import React, { useState, useReducer, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { getRecipe } from '../../actions/RecipeActions';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from '../../reducers/RecipeReducer';
import Thumbnail from "./Thumbnail";
import RecipeInfo from "./RecipeInfo";
import ActualRecipe from "./ActualRecipe";
import RateableStars from './RateableStars';
import Comments from '../Comment/Comments';
import NO_AVATAR from '../../static/no_avatar.svg';
import EditRecipe from "./EditRecipe";
import AddToList from './AddToList.js';
import { UserContext } from '../Context/authContext';
import DeleteRecipe from "./deleteRecipe";
import { useError } from '../ErrorHandler/ErrorHandler';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const userData = useContext(UserContext);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
    const [avatar, setAvatar] = useState(null);
    const { setError } = useError();

    useEffect(() => {
        (async () => {
            const payload = { 'recipe': id }
            const response = await getRecipe(dispatch, payload)
            if (response?.result) {
            }
        })()
    }, [id, MEDIA_URL])

    useEffect(() => {
        if (state?.errorMessage) {
            setError(state.errorMessage)
        }
    },[state])

    useEffect(() => {
        if (state?.recipe?.user?.image) {
            setAvatar(MEDIA_URL + state?.recipe?.user?.image?.image)
        } else {
            setAvatar(NO_AVATAR)
        }

    }, [state?.recipe?.user, MEDIA_URL])

    useEffect(() => {
        setGallery([]);
        state?.recipe?.images?.length > 0 &&
            state?.recipe.images.forEach((image) => {
                if (image.type === 'THUMBNAIL') {
                    setThumbnail(image.image);
                } else if (image.type === 'GALLERY') {
                    setGallery(gallery => [...gallery, image.image]);
                }
            })

    }, [state?.recipe])

    return (
        <Container style={{ margin: 'auto' }}>
            <Row className='container-fluid ml-auto' style={{ paddingTop: '0.5em' }}>
                <Col >
                    {userData?.user?.isAuth && userData?.user?.user?.id === state?.recipe?.user?.id &&
                        <Row className='container-fluid ml-auto'>
                            <Col style={{ display: 'flex', justifyContent: 'left' }}>
                                <EditRecipe recipe={state?.recipe} dispatch={dispatch} />
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'left' }}>
                                <DeleteRecipe recipe={state?.recipe} userData={userData} />
                            </Col>
                        </Row>
                    }
                </Col>
                <Col className='ms-auto' style={{ display: 'flex', justifyContent: 'center' }}>
                    <AddToList recipe={state?.recipe} />
                </Col>
            </Row>
            <Col>
                <RecipeInfo recipe={state?.recipe} avatar={avatar} userData={state?.recipe?.user} />
            </Col>

            <Col style={{ paddingTop: '0' }}>
                {state?.recipe && userData?.user?.isAuth &&
                    <RateableStars rating={state?.recipe?.rating_avg} votes={state?.recipe?.votes} dispatch={dispatch} />
                }
            </Col>
            {thumbnail &&
                <Col style={{ paddingTop: '1em', paddingBottom: '0' }}>
                    <Thumbnail thumbnail={thumbnail} />
                </Col>
            }
            {gallery.length > 0 &&
                <Col>
                    <RecipeCarousel gallery={gallery} />
                </Col>
            }
            <Col >
                <ActualRecipe recipe={state?.recipe} />
            </Col>
            <Comments />
        </Container >
    )
}