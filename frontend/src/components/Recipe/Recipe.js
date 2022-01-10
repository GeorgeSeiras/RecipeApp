import React, { useState, useReducer, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getRecipe } from './actions';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const mediaPath = 'http://localhost:8000/media/'

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
        <div className="recipe">
            {thumbnail &&
                <h3>
                    <img className="thumbnail" src={`${mediaPath}${thumbnail}`} alt="thumbnail" />
                </h3>
            }
            <div className="carousel">
                <RecipeCarousel data={gallery} />
            </div>
        </div>
    )
}