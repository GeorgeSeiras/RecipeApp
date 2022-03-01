import React from 'react';
import Image from 'react-bootstrap/Image';

export default function Thumbnail(props) {
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
    return (
        <div>
            {props?.thumbnail &&
                <Image
                    width="500"
                    className="mx-auto d-block"
                    src={`${MEDIA_URL}${props.thumbnail}`}
                    alt="thumbnail" />
            }
        </div>
    )
}