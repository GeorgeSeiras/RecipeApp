import React from 'react';
import Image from 'react-bootstrap/Image';

export default function Thumbnail(props) {
    const mediaPath = 'http://localhost:8000/media/'

    return (
        <div>
            {props?.thumbnail &&
                <Image
                    width="500"
                    className="mx-auto d-block"
                    src={`${mediaPath}${props.thumbnail}`}
                    alt="thumbnail" />
            }
        </div>
    )
}