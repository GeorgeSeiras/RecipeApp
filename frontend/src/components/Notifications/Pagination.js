import React, { useState, useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';

export default function PaginationBar(props) {

    const disabled = (action) => {
        switch (action) {
            case 'previous':
                return props?.response?.links?.previous;
            case 'next':
                return props?.response?.links?.next;
            default:
                return false;
        }
    }

    const handleClick = (action) => {
        switch (action) {
            case 1:
                props?.setClicked(props?.response?.page + 1);
                return;
            case -1:
                props?.setClicked(props?.response?.page - 1);
        }
    }

    return (
        <Container style={{flex:'1',paddingLeft:'0',paddingRight:'0' }}>
            <Pagination style={{
                flex: '1',
                paddingRight: '0'
            }}>
                <Pagination.Prev
                    key={'prev'}
                    disabled={!disabled('previous')}
                    onClick={() => handleClick(-1)}
                    style={{ flex:'1', textAlign: 'center' }}
                />
                <Pagination.Next
                    key={'next'}
                    disabled={!disabled('next')}
                    onClick={() => handleClick(1)}
                    style={{ flex:'1', textAlign: 'center',marginRight:'0' }}
                />
            </Pagination>
        </Container>
    )
}