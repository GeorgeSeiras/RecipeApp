import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import IMAGE_NOT_FOUND from "../../static/image_not_found_v2.jpg";

import RecipeCard from './RecipeCard';

export default function RecipeCards(props) {
    const [thumbnails, setThumbnails] = useState([])
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    useEffect(() => {
        setThumbnails([])
        props?.response?.results?.forEach((recipe, key) => {
            const img = recipe.images.find((image) => {
                return image.type === "THUMBNAIL"
            })?.image
            if (img) {
                setThumbnails(thumbnails => [...thumbnails, `${MEDIA_URL}${img}`]);
            } else {
                setThumbnails(thumbnails => [...thumbnails, IMAGE_NOT_FOUND]);
            }
        })
    }, [props?.response?.results, MEDIA_URL])

    return (
        <Container style={{ paddingLeft: '0', paddingRight: '0' }}>
            {props?.response?.results &&
                <Row xs={'auto'} className='g-4' style={{ paddingLeft: '1em', paddingRight: '1em' }}>
                    {props.response.results.map((recipe, index) => {
                        return (
                            <RecipeCard key={index}recipe={recipe} index={index} thumbnails={thumbnails} />
                        )
                    })}
                </Row>
            }
        </Container>
    )
}