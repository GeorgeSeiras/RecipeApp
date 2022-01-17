import React, { useState, useReducer, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';

import { getRecipe } from './actions';
import { UserContext } from '../Context/authContext';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';
import Thumbnail from "./Thumbnail";
import RecipeInfo from "./RecipeInfo";
import ActualRecipe from "./ActualRecipe";
import NO_AVATAR from '../../static/no_avatar.svg';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const [user,setUser] = useState();
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
        <div className="recipe" style={{ margin: 'auto' }}>
            <div className="recipeInfo">
                <RecipeInfo recipe={recipe} avatar={avatar} userData={user} />
            </div>
            <div className="thumbnail">
                <Thumbnail thumbnail={thumbnail} />
            </div>
            <div className="carousel">
                <RecipeCarousel gallery={gallery} />
            </div>
            <div className="actualRecipe">
                <ActualRecipe recipe={recipe}/>
            </div>
        </div >
    )
}