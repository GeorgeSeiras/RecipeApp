import React from 'react';
import Image from 'react-bootstrap/Image';

export default function Thumbnail(thumbnail) {
    const mediaPath = 'http://localhost:8000/media/'

    return (
        <div>
            {thumbnail?.data &&
                <Image
                    width="500"
                    className="mx-auto d-block"
                    src={`${mediaPath}${thumbnail.data}`}
                    alt="thumbnail" />
            }
        </div>
    )
}