import React from 'react'
import useError from './ErrorHandler'
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

export default function ErrorComp() {

    const { error, dismissError } = useError();

    console.log(error)
    return (
        <Container style={{
            justifyContent: 'center',
            paddingTop: '0.5em'
        }}>
            {error.length > 0 &&
                <Alert variant={'danger'} style={{ textAlign: 'center' }} dismissible onClose={() => dismissError()}>
                    {error.map((elem, index) => {
                        let message = ''
                        if (elem?.status_code) {
                            message += `${elem.status_code}:`
                        }
                        if (elem?.message) {
                            message += ` ${elem.message}`
                        } else {
                            message += 'Something went wrong, please try again later.'

                        }

                        return <h6 key={index}> {message}</h6>
                    }


                    )}
                </Alert>
            }
        </Container>
    )
}