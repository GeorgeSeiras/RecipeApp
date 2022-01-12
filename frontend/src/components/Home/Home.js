import React, { useEffect, useReducer, useState } from 'react';
import { RecipesReducer } from './reducer'
import { getRecipes } from "./actions"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import IMAGE_NOT_FOUND from "../../static/image_not_found.svg"

export default function Home(props) {

    const [state, dispatch] = useReducer(RecipesReducer);
    const [queryParams, setQueryParams] = useState([]);
    const [response, setResponse] = useState()
    const [thumbnails, setThumbnails] = useState([])
    const mediaPath = 'http://localhost:8000/media/'

    useEffect(() => {
        (async () => {
            const response = await getRecipes(dispatch, queryParams);
            if (response) {
                setResponse(response);
            }
        })()
    }, [])

    useEffect(() => {
        setThumbnails([])
        response?.results.forEach((recipe, key) => {
            const img = recipe.images.find((image) => {
                return image.type === "THUMBNAIL"
            })?.image
            if (img) {
                setThumbnails(thumbnails => [...thumbnails, `${mediaPath}${img}`]);
            } else {
                setThumbnails(thumbnails => [...thumbnails, IMAGE_NOT_FOUND]);
            }
        })
    }, [response?.results])
    
    const handleSubmit = async (event) => {
        // payload.forEach((key, value, index) => {
        //     if (index === 0) {
        //         queryParams = queryParams.concat(`?${key}=${value}`)
        //     } else {
        //         queryParams = queryParams.concat(`&${key}=${value}`)
        //     }
        // })
    }

    return (
        <div>
            <Container>
                {response?.results &&
                    <Row>
                        {response.results.map((recipe, index) => {
                            return (
                                <Col>
                                    <Card>
                                        <Card.Img variant="top"
                                            src={`${thumbnails[index]}`}
                                            alt='card image' />
                                    </Card>
                                </Col>
                            )
                        })}

                    </Row>
                }
            </Container>
        </div>
    )
}