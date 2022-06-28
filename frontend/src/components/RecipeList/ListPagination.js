import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';

export default function PaginationBar(props) {
    console.log(props)
    const disabled = (action) => {
        switch (action) {
            case 'previous':
                return props?.previous;
            case 'next':
                return props?.next;
            default:
                return false;
        }
    }

    const handleClick = (action) => {
        switch (action) {
            case 1:
                props?.setClicked(props?.next);
                return;
            case -1:
                props?.setClicked(props?.previous);
        }
    }
    return (
        <Container style={{paddingLeft: '0', paddingRight: '0',marginBottom:'-1.5em' }}>
                <Pagination style={{
                    flex: '1',
                    paddingRight: '0'
                }}>
                    <Pagination.Prev
                        key={'prev'}
                        disabled={!disabled('previous')}
                        onClick={() => handleClick(-1)}
                        style={{ flex: '1', textAlign: 'center' }}
                    />
                    <Pagination.Next
                        key={'next'}
                        disabled={!disabled('next')}
                        onClick={() => handleClick(1)}
                        style={{ flex: '1', textAlign: 'center' }}
                    />
                </Pagination>
        </Container>
    )
}