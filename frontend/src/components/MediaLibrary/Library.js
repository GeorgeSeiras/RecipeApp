import React, { useEffect, useContext, useState, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';

import { UserContext } from '../Context/authContext';
import { MediaLibraryReducer } from '../../reducers/MediaLibraryReducer';
import { getFolders, getMedia, setCurFolder, createFolder } from '../../actions/MediaLibraryActions';
import add_folder from '../../static/add_folder.webp'
import image_upload from '../../static/image_upload.webp'
import folder_img from '../../static/folder_img.svg'
import previous from '../../static/previous.svg'

import './Library.css';

export default function Library() {
    const [state, dispatch] = useReducer(MediaLibraryReducer)
    const userData = useContext(UserContext);
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
    const [folderName, setFolderName] = useState('');

    useEffect(async () => {
        if (!state?.curFolder) {
            await getFolders(dispatch, null, userData.user.token.key)
        } else {
            const response = await getFolders(dispatch, state?.curFolder?.id, userData.user.token.key)
            if (response.page_size > response.count) {
                const limit = 16 - response.count
                await getMedia(dispatch, state.curFolder.id, limit, state.mediaOffset, userData.user.token.key)
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

    const handleFolderSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            parent: state?.curFolder?.id,
            name: folderName
        }
        await createFolder(dispatch, payload, userData.user.token.key)
    }

    const handleBackClick = (e)=>{
        setCurFolder(dispatch,state.curFolder.parent)
    }

    const overlay = (
        <Popover>
            <Popover.Body style={{ textAlign: 'center' }}>
                <Form onSubmit={(e) => handleFolderSubmit(e)}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Folder Name</Form.Label>
                        <Form.Control
                            maxLength={'25'}
                            type='text'
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                        />
                    </Form.Group>
                    <Button type='submit' variant="success">
                        Create
                    </Button>
                </Form>
            </Popover.Body>
        </Popover>)

    return (
        <Container className='border'>
            <Row xs={'auto'} style={{ justifyContent: 'right', paddingBottom: '1em', paddingTop: '0.2em' }}>
                <Col className='me-auto'>
                    {state?.curFolder &&
                        <Button variant='info' style={{ justifyContent: 'center' }}
                            onClick={(e) => { handleBackClick(e) }}>
                            <Image
                                src={previous}
                                alt='previous_button'
                                width='20px'
                            />
                        </Button>
                    }
                </Col>
                <Col >
                    <OverlayTrigger trigger="click" placement={'left'} overlay={overlay}>
                        <Button variant="success"><Image
                            src={add_folder}
                            alt='add_folder'
                            width='30px'
                        /></Button>
                    </OverlayTrigger>
                </Col>
                <Col >
                    {state?.curFolder &&
                        <Button variant='success'
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
                                    style={{ paddingBottom: '0.5em', objectFit: 'contain' }}

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