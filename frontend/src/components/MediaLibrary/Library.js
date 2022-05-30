import React, { useEffect, useContext, useState, useReducer, createRef, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/esm/Overlay';

import { UserContext } from '../Context/authContext';
import { MediaLibraryReducer } from '../../reducers/MediaLibraryReducer';
import Pagination from './Pagination';
import { getFoldersAndMedia, setCurFolder, createFolder, createMedia, deleteFolder, deleteMedia } from '../../actions/MediaLibraryActions';
import add_folder from '../../static/add_folder.webp'
import image_upload from '../../static/image_upload.webp'
import folder_img from '../../static/folder_img.svg'
import previous from '../../static/previous.svg'
import plus_sign from '../../static/plus_sign.svg'

import './Library.css';

export const Library = (props) => {
    const [state, dispatch] = useReducer(MediaLibraryReducer)
    const userData = useContext(UserContext);
    const MEDIA_URL = process.env.REACT_APP_BACKEND_URL+'/media/';
    const [folderName, setFolderName] = useState('');
    const [mediaName, setMediaName] = useState('');
    const [hiddenInput, setHiddenInput] = useState(createRef(null));
    const [image, setImage] = useState(null);
    const [active, setActive] = useState(1)
    const [pageClicked, setPageClicked] = useState(null);
    const [mediaModal, setMediaModal] = useState(false);
    const [mediaToDeleteId, setMediaToDeleteId] = useState(null);
    const [folderModal, setFolderModal] = useState(false);
    const [folderToDeleteId, setFolderToDeleteId] = useState(null);
    const folderRef = useRef(null)
    const [folderShow, setFolderShow] = useState(false)
    const mediaRef = useRef(null)
    const [mediaShow, setMediaShow] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await getFoldersAndMedia(dispatch, state?.curFolder?.id, pageClicked, userData.user.token.key)
            if (response?.results) {
                setActive(pageClicked);
            }
        })()
    }, [state?.curFolder, pageClicked])

    const handleFolderClick = (e) => {
        e.preventDefault()
        const folderId = e.target.parentNode.parentNode.id
        const folder = state.foldersAndMedia.results.find(elem => {
            return elem.id === Number(folderId)
        })
        setCurFolder(dispatch, folder);
    }

    const handleImageSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('image', image)
        formData.append('name', mediaName)
        formData.append('folder', state.curFolder.id)
        await createMedia(dispatch, formData, userData.user.token.key)
        await getFoldersAndMedia(dispatch, state?.curFolder?.id, pageClicked, userData.user.token.key)
        setImage(false)
        setMediaName(null)
        setMediaShow(false);

    }

    const handleFolderSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            parent: state?.curFolder?.id,
            name: folderName
        }
        await createFolder(dispatch, payload, userData.user.token.key)
        await getFoldersAndMedia(dispatch, state?.curFolder?.id, pageClicked, userData.user.token.key)
        setFolderName('')
        setFolderShow(false)

    }

    const handleBackClick = (e) => {
        e.preventDefault()
        setCurFolder(dispatch, state.curFolder.parent)
    }

    const handleFolderDelete = async (e) => {
        e.preventDefault()
        await deleteFolder(dispatch, userData.user.token.key, folderToDeleteId)
        await getFoldersAndMedia(dispatch, state?.curFolder?.id, pageClicked, userData.user.token.key)
        setFolderModal(false)
    }

    const handleMediaDelete = async (e) => {
        e.preventDefault()
        await deleteMedia(dispatch, userData.user.token.key, mediaToDeleteId)
        await getFoldersAndMedia(dispatch, state?.curFolder?.id, pageClicked, userData.user.token.key)
        setMediaModal(false)
    }

    const overlayFolder = (
        <Popover style={{width:'200px'}}>
            <Popover.Body style={{ textAlign: 'center' }}>
                <>
                    <Form.Group className='mb-2'>
                        <Form.Label>Folder Name</Form.Label>
                        <Form.Control
                            maxLength={'25'}
                            type='text'
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                        />
                    </Form.Group>
                    <Button onClick={(e) => { handleFolderSubmit(e) }} type='submit' variant="success" disabled={folderName === ''}>
                        Create
                    </Button>
                </>
            </Popover.Body>
        </Popover>)

    const overlayMedia = (
        <Popover >
            <Popover.Body style={{ textAlign: 'center',width:'200px' }}>
                <>
                    <Form.Group>
                        <Form.Control
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp"
                            ref={hiddenInput}
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ display: 'none' }} />
                    </Form.Group>
                    <Image
                        style={{
                            width: '12em',
                            height: 'auto',
                            maxHeight: '18em',
                            cursor: 'pointer'
                        }}
                        src={image ? URL.createObjectURL(image) : plus_sign}
                        alt='thumbnail'
                        onClick={(e) => { hiddenInput.current.click() }} />
                    <Form.Group className='mb-2'>
                        <Form.Label>Image Name</Form.Label>
                        <Form.Control
                            maxLength={'25'}
                            type='text'
                            value={mediaName}
                            onChange={(e) => setMediaName(e.target.value)}
                        />
                    </Form.Group>
                    <Button onClick={(e) => handleImageSubmit(e)} type='submit' variant="success" disabled={(image === null || mediaName === '')}>
                        Create
                    </Button>
                </>
            </Popover.Body>
        </Popover>)
    return (
        <Container className='border' id='media-library'>
            <Row xs={'auto'} style={{ justifyContent: 'right', paddingBottom: '1em', paddingTop: '0.2em' }}>
                <Col className='me-auto' >
                    {state?.curFolder &&
                        <Button variant='info' style={{ justifyContent: 'center' }}
                            onClick={(e) => handleBackClick(e)} data-modal="false">
                            <Image
                                src={previous}
                                alt='previous_button'
                                width='20px'
                            />
                        </Button>
                    }
                </Col>
                <Col >
                    <Button variant="success"
                        onClick={() => { setFolderShow(!folderShow) }}
                        ref={folderRef}
                    >
                        <Image
                            src={add_folder}
                            alt='add_folder'
                            width='30px'
                        />
                    </Button>
                    <Overlay target={folderRef.current} show={folderShow} rootClose={true} onHide={() => setFolderShow(false)} >
                        {({ placement, arrowProps, show: _show, popper, ...props }) => (
                            <div {...props}
                                style={{
                                    position: 'absolute',
                                    maxWidth: '50px',
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    color: 'black',
                                    borderRadius: 3,
                                    ...props.style,
                                }}
                            >
                                {overlayFolder}
                            </div>
                        )}
                    </Overlay>
                </Col>
                <Col >
                    {state?.curFolder &&
                        <>
                            <Button variant='success' ref={mediaRef} onClick={()=>setMediaShow(!mediaShow)}>
                                <Image
                                    src={image_upload}
                                    alt='image_upload'
                                    width='30px'
                                />
                            </Button>
                            <Overlay target={mediaRef.current} show={mediaShow} rootClose={true} onHide={() => setMediaShow(false)} >
                                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                                    <div {...props}
                                        style={{
                                            position: 'absolute',
                                            maxWidth: '50px',
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            color: 'black',
                                            borderRadius: 3,
                                            ...props.style,
                                        }}
                                    >
                                        {overlayMedia}
                                    </div>
                                )}
                            </Overlay>
                        </>
                    }
                </Col>
            </Row>
            <Row xs={'auto'} style={{ maxWidth: '700px' }}  >
                {state?.foldersAndMedia?.results &&
                    state.foldersAndMedia.results.map((folderOrMedia, index) => {
                        if (folderOrMedia.type === 'folder') {
                            return (
                                <Col key={index} id={folderOrMedia.id}
                                    style={{ paddingBottom: '1em', textAlign: 'center' }}>
                                    <Container style={{ position: 'relative', padding: '0' }}>
                                        <Image
                                            src={folder_img}
                                            onClick={(e) => { handleFolderClick(e) }}
                                            cursor='pointer'
                                            width='80px'
                                            style={{ paddingBottom: '0.5em' }}
                                        />
                                        <h6>{folderOrMedia.name}</h6>
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
                                                setFolderToDeleteId(e.target.parentNode.parentNode.id)
                                                setFolderModal(true)
                                            }}>X</Button>
                                    </Container>
                                </Col>
                            )
                        } else if (folderOrMedia.type === 'image') {
                            return (
                                <Col key={index} id={folderOrMedia.id} style={{ paddingBottom: '1em', textAlign: 'center' }}>
                                    <Container style={{ position: 'relative', padding: '0' }}>
                                        <Image
                                            src={`${MEDIA_URL}${folderOrMedia.image}`}
                                            onClick={(e) => { props?.handleInsertImage(e) }}
                                            width='150px'
                                            height='auto'
                                            style={{ paddingBottom: '0.5em', objectFit: 'contain' }}

                                        />
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
                                                setMediaToDeleteId(e.target.parentNode.parentNode.id)
                                                setMediaModal(true)
                                            }}>X</Button>
                                        <h6>{folderOrMedia.name}</h6>
                                    </Container>
                                </Col>
                            )
                        }
                    })
                }
            </Row>
            {state?.foldersAndMedia?.total_pages &&
                <Row xs={'auto'} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination active={active} totalPages={state.foldersAndMedia.total_pages} setPageClicked={setPageClicked} />
                </Row>
            }

            <Modal show={folderModal} onHide={() => setFolderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Folder?
                    This action is not reversible
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setFolderModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleFolderDelete()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={mediaModal} onHide={() => setMediaModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Media</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Media?
                    This action is not reversible
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMediaModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleMediaDelete()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
}