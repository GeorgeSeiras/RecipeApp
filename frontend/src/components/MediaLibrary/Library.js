import React, { useEffect, useContext, useState, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { UserContext } from '../Context/authContext';
import { MediaLibraryReducer } from '../../reducers/MediaLibraryReducer';
import { getFolders, getMedia, setCurFolder } from '../../actions/MediaLibraryActions';
import add_folder from '../../static/add_folder.webp'
import image_upload from '../../static/image_upload.webp'
import folder_img from '../../static/folder_img.svg'

export default function Library() {
    const [state, dispatch] = useReducer(MediaLibraryReducer)
    const userData = useContext(UserContext);
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    useEffect(async () => {
        if (!state?.curFolder) {
            await getFolders(dispatch, null, userData.user.token.key)
        } else {
            await getFolders(dispatch, state?.curFolder?.id, userData.user.token.key)
            if (state?.folders.page_size > state?.folders?.count) {
                await getMedia(dispatch, state.curFolder.id, state.mediaLimit, state.mediaOffset, userData.user.token.key)

            }
        }
    }, [state?.curFolder])

    const handleFolderClick = (e) => {
        const folderId = e.target.parentNode.id
        const folder = state.folders.results.find(elem => {
            return elem.id === Number(folderId)
        })
        setCurFolder(dispatch, folder);
    }

    const handleImageClick = (e) => {
        console.log('image clicked')
    }

    console.log(state?.media?.results)
    return (
        <Container className='border'>
            <Row xs={'auto'} style={{ justifyContent: 'right', paddingBottom: '1em' }}>
                <Col >
                    <Button variant='success'
                        onClick={() => { console.log('click') }}
                    >
                        <Image
                            src={add_folder}
                            alt='add_folder'
                            width='30px'
                        />
                    </Button>
                </Col>
                <Col >
                    {state?.curFolder &&
                        <Button variant='sucess'
                            onClick={() => { console.log('click') }}
                        >
                            <Image
                                src={image_upload}
                                alt='upload_image'
                                width='30px'

                            />
                        </Button>}
                </Col>
            </Row>
            <Row xs={'auto'}>
                {state?.folders?.results &&
                    state.folders.results.map((folder, index) => {
                        return (
                            <Col key={index} id={folder.id} style={{ paddingBottom: '1em', textAlign: 'center' }}>
                                <Image
                                    src={folder_img}
                                    onClick={(e) => { handleFolderClick(e) }}
                                    width='80px'
                                    style={{ paddingBottom: '0.5em' }}

                                />
                                <h6>{folder.name}</h6>
                            </Col>
                        )
                    })
                }
                {
                    state?.media?.results &&
                    state.media.results.map((media, index) => {
                        return (
                            <Col key={index} id={media.id} style={{ paddingBottom: '1em', textAlign: 'center' }}>
                                <Image
                                    src={`${MEDIA_URL}${media.image}`}
                                    onClick={(e) => { handleImageClick(e) }}
                                    width='150px'
                                    height='auto'
                                    style={{ paddingBottom: '0.5em',objectFit: 'contain',backgroundColor:'black'  }}

                                />
                                <h6>{media.name}</h6>
                            </Col>
                        )
                    })
                }
            </Row>
        </Container >
    )
}