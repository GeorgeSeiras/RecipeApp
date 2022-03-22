import React from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { DateTime } from 'luxon';

import RatingStars from './RatingStar';


export default function RecipeCard(props) {
    const navigate = useNavigate();

    return (
        <Col key={props.index} style={{ paddingLeft: '2%', paddingRight: '2%' }} onClick={(e) => navigate(`/recipe/${props.recipe.id}`)}>
            <Card
                id={props.recipe.id}
                border="dark"
                style={{
                    cursor: "pointer",
                    height: '23em',
                    width: '13em',
                    paddingTop: '0.1em',
                    paddingBottom: '0.1em',
                    paddingLeft: '0.1em',
                    paddingRight: '0.1em',
                }}>

                <Card.Img variant="top"
                    style={{ width: 'auto', height: '10em', paddingBottom: '0' }}
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
                            {props.recipe.user.username}
                        </Card.Link>
                    </Card.Subtitle>
                </Card.Body>
                <Card.Footer className="text-muted" style={{ display: 'flex', justifyContent: 'center', height: '4em' }}>
                    {`Last updated ${DateTime.fromSQL(props.recipe.updated_at).toFormat('dd LLL yyyy').toLocaleString()}`}
                </Card.Footer>
            </Card>
        </Col>
    )
}