import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css'

export default function RecipeCarousel(gallery) {
    const mediaPath = 'http://localhost:8000/media/';

    return (
        <div>
            <Carousel>
                {gallery?.data.length > 0 &&
                    gallery.data.map((image, index) => {
                        return <Carousel.Item interval={5000} key={index}>
                            <img
                                className="d-block w-100"
                                src={`${mediaPath}${image}`}
                                alt="carousel_item" />
                        </Carousel.Item>
                    })
                }
            </Carousel>
        </div>
    )
} 