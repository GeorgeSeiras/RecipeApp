import React, { useState, useReducer } from 'react';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';

import { createReport } from '../../actions/ReportActions'
import { ReportReducer } from '../../reducers/ReportReducer'
import red_flag from '../../static/red_flag.svg'

export default function ReportButton(props) {
    const [desc, setDesc] = useState('');
    const [reason, setReason] = useState('OFFENSIVE_CONTENT');
    const [state, dispatch] = useReducer(ReportReducer);
    const [show, setShow] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = props?.userData?.user?.token?.key
        const payload = {
            'object_id': props?.id,
            'desc': desc,
            'reason': reason,
            'type': props?.type
        }
        const res = await createReport(dispatch, payload, token)
        if (res?.result) {
            setShow(true)
        }
    }

    const disabled = () => {
        if (desc === '') {
            return false
        }
        return true
    }

    return (
        <Container >

            <OverlayTrigger
                overlay={<Popover>
                    <Popover.Body>
                        <Alert show={show} variant="success" dismissible onClick={() => setShow(false)}>
                            <Alert.Heading>Report was successfuly created!</Alert.Heading>
                        </Alert>
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Form.Group className="mb-3">
                                <Form.Label></Form.Label>
                                <Form.Select onChange={(e) => setReason(e.target.value)}>
                                    <option value='OFFENSIVE_CONTENT'>OFFENSIVE CONTENT</option>
                                    <option value='UNRELATED_CONTENT'>UNRELATED CONTENT</option>
                                    <option value='OTHER'>OTHER</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    maxLength='150'
                                    type='text'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant='danger' type='submit' disabled={!disabled()}>
                                Report
                            </Button>
                        </Form>
                    </Popover.Body>
                </Popover>}
                trigger='click' placement={'bottom'}>
                <Image
                    width='25'
                    src={red_flag}
                    alt='report_button'
                />
            </OverlayTrigger>
        </Container>
    )
}