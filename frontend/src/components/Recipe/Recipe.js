import React, { useState, useReducer, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getRecipe } from './actions';
import { RecipeReducer } from './reducer';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [galleryState, setGalleryState] = useState(0);
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
        recipe?.images?.length > 0 &&
            recipe.images.map((image) => {
                if (image.type === 'THUMBNAIL') {
                    setThumbnail(image.image);
                } else if (image.type === 'GALLERY') {
                    setGallery(gallery => [...gallery, image.image]);
                }
                return true;
            })
    }, [recipe])

    const onClickNext = () => {
        if (galleryState + 1 === gallery.length) {
            setGalleryState(0)
        } else {
            setGalleryState(galleryState + 1)
        }
    }

    const onClickPrevious = () => {
        if (galleryState - 1 === -1) {
            setGalleryState(gallery.length - 1)
        } else {
            setGalleryState(galleryState - 1)
        }
    }

    return (
        <div className="recipe">
            {thumbnail &&
                <h3>
                    <img className="thumbnail" src={`${mediaPath}${thumbnail}`} alt="avatar" />
                </h3>
            }
            {gallery.length > 0 &&
                <div className="gallery">
                    <img src={`${mediaPath}${gallery[galleryState]}`} alt="gallery" />
                    <button onClick={onClickPrevious}>Previous</button>
                    <button onClick={onClickNext}>Next</button>
                </div>
            }
        </div>
    )
}