import React from 'react';
import Image from 'react-bootstrap/Image';

export default function Thumbnail(props) {
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';
    return (
        <div>
            {props?.thumbnail &&
                <Image
                    style={{width:'500px',height:'700px',objectFit:'contain'}}
                    className="mx-auto d-block"
                    src={`${MEDIA_URL}${props.thumbnail}`}
                    alt="thumbnail" />
            }
        </div>
    )
}