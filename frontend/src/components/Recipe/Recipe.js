import React, { useState, useReducer, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';

import { getRecipe } from './actions';
import { UserContext } from '../Context/authContext';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';
import Thumbnail from "./Thumbnail";
import RecipeInfo from "./RecipeInfo";
import NO_AVATAR from '../../static/no_avatar.svg';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const userData = useContext(UserContext);
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const mediaPath = 'http://localhost:8000/media/';
    const [avatar, setAvatar] = useState(null);
    


    useEffect(() => {
        if (userData?.user?.user?.image?.image) {
            setAvatar(mediaPath + userData?.user?.user?.image?.image)
        } else {
            setAvatar(NO_AVATAR)
        }
        
    }, [userData?.user?.user?.image?.image])

    useEffect(() => {
        (async () => {
            const payload = { 'recipe': id }
            const response = await getRecipe(dispatch, payload)
            if (response?.result) {
                setRecipe(response.result)
            }
        })()
    }, [id])

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
        <div className="recipe" style={{ margin: 'auto' }}>
            <div className="recipeInfo">
                <RecipeInfo recipe={recipe} avatar={avatar} userData={userData} />
            </div>
            <div className="thumbnail">
                <Thumbnail data={thumbnail} />
            </div>
            <div className="carousel">
                <RecipeCarousel data={gallery} />
            </div>
        </div >
    )
}