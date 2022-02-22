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
import RatingStars from '../Home/RatingStar';
import NO_AVATAR from '../../static/no_avatar.svg';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const [user, setUser] = useState();
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const mediaPath = 'http://localhost:8000/media/';
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
    }, [id])

    useEffect(() => {
        if (user?.image) {
            setAvatar(mediaPath + user?.image?.image)
        } else {
            setAvatar(NO_AVATAR)
        }

    }, [user])

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
            <Col style={{ paddingTop: '0'}}>
                <RatingStars size={'medium'} rating={recipe?.rating_avg} votes={recipe?.votes} />
            </Col>
            {thumbnail &&
                <Col style={{paddingTop:'1em', paddingBottom:'0'}}>
                    <Thumbnail thumbnail={thumbnail} />
                </Col>
            }
            {gallery.length>0 &&
                <Col>
                    <RecipeCarousel gallery={gallery} />
                </Col>
            }
            <Col >
                <ActualRecipe recipe={recipe} />
            </Col>
        </Container >
    )
}