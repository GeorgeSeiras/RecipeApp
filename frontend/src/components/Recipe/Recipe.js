import React, { useState, useReducer, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';

import { getRecipe } from './actions';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';
import Thumbnail from "./Thumbnail";
import RecipeInfo from "./RecipeInfo";
import ActualRecipe from "./ActualRecipe";
import RateableStars from './RateableStars';
import Comments from '../Comment/Comments';
import NO_AVATAR from '../../static/no_avatar.svg';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const [user, setUser] = useState();
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        (async () => {
            const payload = { 'recipe': id }
            const response = await getRecipe(dispatch, payload)
            if (response?.result) {
                setRecipe(response.result)
                setUser(response.result.user)
            }
        })()
    }, [id, MEDIA_URL])

    useEffect(() => {
        if (user?.image) {
            setAvatar(MEDIA_URL + user?.image?.image)
        } else {
            setAvatar(NO_AVATAR)
        }

    }, [user, MEDIA_URL])

    useEffect(() => {
        setGallery([]);
        recipe?.images?.length > 0 &&
            recipe.images.forEach((image) => {
                if (image.type === 'THUMBNAIL') {
                    setThumbnail(image.image);
                } else if (image.type === 'GALLERY') {
                    setGallery(gallery => [...gallery, image.image]);
                }
            })

    }, [recipe])

    return (
        <Container className="recipe" style={{ margin: 'auto' }}>
                <Col>

                    <RecipeInfo recipe={recipe} avatar={avatar} userData={user} />
                </Col>

            <Col style={{ paddingTop: '0' }}>
                {recipe?.rating_avg &&
                    <RateableStars rating={recipe?.rating_avg} votes={recipe?.votes} setRecipe={setRecipe} />
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
                <ActualRecipe recipe={recipe} />
            </Col>
            <Comments />
        </Container >
    )
}