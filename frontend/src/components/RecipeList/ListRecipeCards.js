import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import IMAGE_NOT_FOUND from "../../static/image_not_found.svg";

import RecipeCard from '../Home/RecipeCard';

export default function ListRecipeCards(props) {
    const [thumbnails, setThumbnails] = useState([])
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    useEffect(() => {
        setThumbnails([])
        props?.response?.results.forEach((recipe, key) => {
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
                <Row xs={2} md={3} lg={5} className='g-4' >
                    {props.response.results.map((recipe, index) => {
                        return (
                            <Container key={index} style={{
                                position: 'relative',
                                width:'16em',
                                paddingLeft:'0',
                                marginRight:'0',
                                marginLeft:'0'
                            }}>

                                <RecipeCard recipe={recipe} index={index} thumbnails={thumbnails} />
                                <Button
                                    variant="danger"
                                    style={{
                                        width: '1.5em',
                                        height: '1.5em',
                                        position: "absolute",
                                        top: "0",
                                        right: "3em",
                                        padding: '0',
                                        textAlign: 'center',
                                    }}
                                    onClick={(e) => {
                                        console.log('click');
                                    }}>X</Button>
                            </Container>)
                    })}
                </Row>
            }
        </Container>
    )
}