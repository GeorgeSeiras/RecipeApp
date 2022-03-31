import React from 'react'
import useError from './ErrorHandler'
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

export default function ErrorComp() {

    const { error } = useError();

    return (
        <Container style={{
            justifyContent: 'center',
            paddingTop:'0.5em'
        }}>
            {error.length > 0 &&
                <Alert variant={'danger'} style={{ textAlign: 'center' }}>
                    {error.map((elem, index) => {
                        return <h6 key={index}> {elem.status_code}: {elem.message}</h6>

                    })}
                </Alert>
            }
        </Container>
    )
}