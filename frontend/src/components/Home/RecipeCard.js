import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { DateTime } from 'luxon';
import NO_AVATAR from '../../static/no_avatar.svg';

import RatingStars from './RatingStar';

export default function RecipeCard(props) {
    const navigate = useNavigate();
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        if (props.recipe.user?.image) {
            setAvatar(MEDIA_URL + props.recipe.user?.image)
        } else {
            setAvatar(NO_AVATAR)
        }

    }, [props.recipe.user?.image, MEDIA_URL])

    return (
        <Col>
            {props?.recipe &&

                <Card
                    key={props.index} onClick={(e) => navigate(`/recipe/${props.recipe.id}`)}
                    id={props.recipe.id}
                    border="dark"
                    style={{
                        cursor: "pointer",
                        height: '25.5em',
                        width: '280px',
                        paddingBottom: '0.1em',

                    }}>

                    <Card.Img variant="top"
                        style={{ height: '260px', objectFit: 'cover', paddingBottom: '0' }}
                        src={`${props.thumbnails[props.index]}`}
                        alt='card image' />
                    <Row >
                        <RatingStars size={'small'} rating={props.recipe.rating_avg} votes={props.recipe.votes} />
                    </Row>
                    <Card.Body style={{ paddingTop: '0' }}>
                        <Card.Title >{props.recipe.title}</Card.Title>
                        <Card.Subtitle style={{ height: '0.1em' }}>
                            <Card.Link className="text-muted" href={`/user/${props.recipe.user.username}`}
                                style={{
                                    color: 'black',
                                    textDecoration: 'none'
                                }}>
                                <Image
                                    width='25'
                                    className='img-fluid rounded-circle'
                                    src={avatar}
                                    alt='avatar'
                                />
                                {props.recipe.user.username}
                            </Card.Link>
                        </Card.Subtitle>
                    </Card.Body>
                    <Card.Footer className="text-muted" style={{ display: 'flex', justifyContent: 'center', height: '3em', fontSize: '13px' }}>
                        {`Last updated ${DateTime.fromSQL(props.recipe.updated_at).toFormat('dd LLL yyyy').toLocaleString()}`}
                    </Card.Footer>
                </Card>
            }
        </Col>
    )
}