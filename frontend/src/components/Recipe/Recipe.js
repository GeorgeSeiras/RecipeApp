import React, { useState, useReducer, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import { getRecipe } from './actions';
import { UserContext } from '../Context/authContext';
import RecipeCarousel from "./Carousel";
import { RecipeReducer } from './reducer';
import Thumbnail from "./Thumbnail";
import NO_AVATAR from '../../static/no_avatar.svg';

export default function Recipe() {
    const [state, dispatch] = useReducer(RecipeReducer);
    const userData = useContext(UserContext);
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [gallery, setGallery] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const mediaPath = 'http://localhost:8000/media/';
    const [avatar, setAvatar] = useState(null);

    const [createdAt, setCreatedAt] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);

    useEffect(() => {
        if (userData?.user?.user?.image?.image) {
            setAvatar('http://localhost:8000/media/' + userData?.user?.user?.image?.image)
        } else {
            setAvatar(NO_AVATAR)
        }
    }, [userData?.user?.user?.image?.image])

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
        if (recipe?.updated_at) {
            setUpdatedAt(DateTime.fromSQL(recipe?.updated_at).toFormat('dd LLL yyyy'));
        }
        if (recipe?.created_at) {
            setCreatedAt(DateTime.fromSQL(recipe?.created_at).toFormat('dd LLL yyyy'));
        }
    }, [recipe])

    console.log(updatedAt)
    return (
        <div className="recipe" style={{ margin: 'auto' }}>
            <div className="recipeData">
                {userData?.user?.user && recipe &&
                    <Container >
                        <Row xs="auto">
                            <Col style={{ paddingRight: "5" }}>
                                <Image
                                    width='60'
                                    className='img-fluid rounded-circle'
                                    src={`${avatar}`}
                                    alt='avatar'
                                />
                            </Col>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <h6 style={{ position: 'relative', top: '35%' }}>
                                    Written By:
                                </h6>
                            </Col>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Nav.Item style={{ position: 'relative', top: '18%' }}>
                                    <Nav.Link
                                        style={{ color: 'black' }}
                                        href={`/user/${userData.user.user.username}`}>
                                        {userData.user.user.username}
                                    </Nav.Link>
                                </Nav.Item>
                            </Col>
                        </Row>
                        <Row xs="auto" >
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                {createdAt &&
                                    <h6>
                                        Posted: {createdAt.toLocaleString()}
                                    </h6>
                                }
                            </Col>
                            <Col style={{ paddingRight: "0" }}>
                                {updatedAt &&
                                    <h6>
                                        Updated: {updatedAt.toLocaleString()}
                                    </h6>
                                }
                            </Col>
                        </Row>
                    </Container>
                }
            </div>
            <div className="thumbnail">
                <Thumbnail data={thumbnail} />
            </div>
            <div className="carousel">
                <RecipeCarousel data={gallery} />
            </div>
        </div >
    )
}