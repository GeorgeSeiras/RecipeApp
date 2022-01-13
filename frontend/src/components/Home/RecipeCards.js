import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import IMAGE_NOT_FOUND from "../../static/image_not_found.svg"
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function RecipeCards(props) {

    const [thumbnails, setThumbnails] = useState([])
    const mediaPath = 'http://localhost:8000/media/'

    useEffect(() => {
        setThumbnails([])
        props?.response?.results.forEach((recipe, key) => {
            const img = recipe.images.find((image) => {
                return image.type === "THUMBNAIL"
            })?.image
            if (img) {
                setThumbnails(thumbnails => [...thumbnails, `${mediaPath}${img}`]);
            } else {
                setThumbnails(thumbnails => [...thumbnails, IMAGE_NOT_FOUND]);
            }
        })
    }, [props?.response?.results])

    return (
        <div>
            {props?.response?.results &&
                <Row xs={2} md={3} lg={5} className='g-4' style={{ paddingLeft: '1em', paddingRight: '1em' }}>
                    {props.response.results.map((recipe, index) => {
                        return (
                            <Col key={index}>
                                <Card
                                    border="dark"
                                    style={{
                                        height: '23em',
                                        width: '13em',
                                        paddingTop: '0.1em',
                                        paddingBottom: '0.1em',
                                        paddingLeft: '0.1em',
                                        paddingRight: '0.1em',
                                    }}>
                                    <Card.Img variant="top"
                                        style={{ width: 'auto', height: '10em', paddingBottom: '0' }}
                                        src={`${thumbnails[index]}`}
                                        alt='card image' />
                                    <Card.Body style={{ paddingTop: '0.4em' }}>
                                        <Card.Title >{recipe.title}</Card.Title>
                                        <Card.Subtitle style={{ height: '0.1em' }}>
                                            <Card.Link className="text-muted" href={`/user/${recipe.user.username}`}
                                                style={{
                                                    color: 'black',
                                                    textDecoration: 'none'
                                                }}>
                                                {recipe.user.username}</Card.Link>
                                        </Card.Subtitle>
                                    </Card.Body>
                                    <Card.Footer className="text-muted" style={{ display: 'flex', justifyContent: 'center', height: '4em' }}>
                                        {`Last updated ${DateTime.fromSQL(recipe.updated_at).toFormat('dd LLL yyyy').toLocaleString()}`}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            }
        </div>
    )
}