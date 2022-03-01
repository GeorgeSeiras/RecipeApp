import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image'

export default function RecipeCarousel(props) {
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    return (
        <div>
            <Carousel style={{
                width: "700px",
                height: "950",
                margin: "auto",
                paddingTop: "5%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {props?.gallery.length > 0 &&
                    props.gallery.map((image, index) => {
                        return (
                            <Carousel.Item
                                interval={5000}
                                key={index}>
                                <Image

                                    className="d-block w-100"
                                    src={`${MEDIA_URL}${image}`}
                                    alt="carousel_item" />
                            </Carousel.Item>
                        )
                    })
                }
            </Carousel>
        </div>
    )
} 