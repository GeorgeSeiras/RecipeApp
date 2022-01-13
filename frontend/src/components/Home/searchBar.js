import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default function SearchBar(props) {

    const [title, setTitle] = useState();
    const [cuisine, setCuisine] = useState();
    const [course, setCourse] = useState();
    
    return (
        <Form className="d-flex"
            style={{
                paddingTop: '0.5em',
                paddingBottom: '1em'
            }}>
            <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
            />
            <Button variant="outline-success">Search</Button>
        </Form>
    )
}