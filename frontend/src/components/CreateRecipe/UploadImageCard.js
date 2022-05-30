import React, { useState, useEffect, createRef } from 'react';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import plus_sign from '../../static/plus_sign.svg'

export default function ImageUploadCard(props) {
    const [hiddenInputs, setHiddenInputs] = useState([]);
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (props?.images && props?.images.length > 0) {
            var refs = []
            for (var i = 0; i < props.images.length; i++) {
                refs[i] = createRef();
            }
            setHiddenInputs(refs)
        } else {
            setHiddenInputs([createRef()])
        }
    }, [props?.images])

    const handleClick = (e) => {
        hiddenInputs[parseInt(e.target.parentNode.id)].current.click();
    }

    const uploadImage = (e) => {
        const fileUploaded = e.target.files[0];
        switch (props.type) {
            case 'single':
                props.setImages(fileUploaded)
                return;
            case 'many':
                var copy = [...props.images];
                copy[e.target.parentNode.id] = fileUploaded;
                if (copy.indexOf(null) === -1) {
                    copy.push(null);
                }
                props.setImages(copy);
                return;
            default:
                console.log('This component accepts only single and many as its options')
                return;
        }
    }

    const removeCarouselImage = (e) => {
        var copy = [...props.images];
        copy.splice(e.target.parentNode.parentNode.id, 1);
        if (copy.length === 0) {
            copy.push(null)
        }
        props.setImages(copy);
    }

    useEffect(() => {
        (async () => {
            setImages([])
            if (props.type === 'single') {
                if (!props.images) {
                    setImages(plus_sign);
                } else {
                    if (props.images instanceof File) {
                        setImages(URL.createObjectURL(props.images));
                    } else {
                        setImages(`${MEDIA_URL}${props.images}`);
                    }
                }
            } else if (props.type === 'many') {
                props?.images.forEach((image) => {
                    if (!image) {
                        setImages(images => [...images, plus_sign]);
                    } else {
                        if (image instanceof File) {
                            setImages(images => [...images, URL.createObjectURL(image)]);
                        } else {
                            setImages(images => [...images, `${MEDIA_URL}${image}`])
                        }
                    }
                })
            }
        })();
    }, [props.images, props.type]);

    return (
        <Row style={{ marginLeft: '0' }}>
            {props.type === 'single' && hiddenInputs.length > 0 &&
                <Container style={{
                    position: 'relative',
                    width: '12rem',
                    height: 'auto',
                    paddingLeft: '0',
                    marginLeft: '0',
                }}>
                    <Col id={0} style={{ paddingLeft: '0' }}>
                        <Image
                            style={{
                                width: '12em',
                                height: 'auto',
                                maxHeight: '18em',
                                cursor: 'pointer'
                            }}
                            src={images}
                            alt='thumbnail'
                            onClick={(e) => { handleClick(e) }}
                        />
                        {props?.images != null &&
                            <Container>
                                <Button
                                    variant="danger"
                                    style={{
                                        width: '1.5em',
                                        height: '1.5em',
                                        position: "absolute",
                                        top: "0",
                                        right: "0",
                                        padding: '0',
                                        textAlign: 'center',
                                    }}
                                    onClick={(e) => {
                                        props.setImages(null);
                                    }}>X</Button>
                            </Container>
                        }
                        <Form.Group>
                            <Form.Control
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp" ref={hiddenInputs[0]}
                                onChange={(e) => uploadImage(e)}
                                style={{ display: 'none' }} />
                        </Form.Group>
                    </Col>

                </Container>}
            {props.type === 'many' && hiddenInputs.length > 0 &&
                props.images.map((image, index) => {
                    return (
                        <Col key={index}
                            style={{
                                paddingRight: '0',
                                paddingLeft: '0',
                                paddingTop: '1em',
                                display: 'table-cell',
                                maxWidth: '13em'
                            }}>
                            <Container style={{
                                position: 'relative',
                                paddingLeft: '0',
                                paddingRight: '0',
                                marginRight: '0',
                                display: 'table-cell',
                            }}
                                key={index}
                                id={index}>
                                <Image
                                    style={{
                                        width: '12em',
                                        height: 'auto',
                                        maxHeight: '18em',
                                        cursor: 'pointer',

                                    }}
                                    src={images[index]}
                                    alt='carousel'
                                    onClick={(e) => handleClick(e)}
                                />
                                {props?.images[index] != null &&
                                    <Container>
                                        <Button
                                            variant="danger"
                                            style={{
                                                width: '1.5em',
                                                height: '1.5em',
                                                position: "absolute",
                                                top: "0",
                                                right: "0",
                                                padding: '0',
                                                textAlign: 'center',
                                            }}
                                            onClick={(e) => {
                                                removeCarouselImage(e);
                                            }}>X</Button>
                                    </Container>
                                }
                                <Form.Control
                                    type="file"
                                    ref={hiddenInputs[index]}
                                    onChange={(e) => uploadImage(e)}
                                    style={{ display: 'none' }} />

                            </Container>
                        </Col>
                    )
                })
            }

        </Row >
    )
}