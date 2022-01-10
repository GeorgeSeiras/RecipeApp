import React, { useState, useReducer, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getRecipe } from './actions';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';
import Thumbnail from "./Thumbnail";

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();

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
            <div className="thumbnail">
                <Thumbnail data={thumbnail} />
            </div>
            <div className="carousel">
                <RecipeCarousel data={gallery} />
            </div>
        </div>
    )
}