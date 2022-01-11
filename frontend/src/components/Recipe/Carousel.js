import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image'

export default function RecipeCarousel(props) {
    const mediaPath = 'http://localhost:8000/media/';

    return (
        <div>
            <Carousel style={{
                width: "700px",
                height: "auto",
                margin: "auto",
                paddingTop: "5%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>
                {props?.gallery.length > 0 &&
                   props.gallery.map((image, index) => {
                        return (
                            <Carousel.Item
                                interval={5000}
                                key={index}>
                                <Image
                                    className="d-block w-100"
                                    src={`${mediaPath}${image}`}
                                    alt="carousel_item" />
                            </Carousel.Item>
                        )
                    })
                }
            </Carousel>
        </div>
    )
} 