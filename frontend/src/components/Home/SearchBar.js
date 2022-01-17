import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function SearchBar(props) {

    const [title, setTitle] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [course, setCourse] = useState('');
    const [username, setUsername] = useState('');
    const [sort, setSort] = useState('desc');
    const [titleAdvanced, setTitleAdvanced] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (title) {
            props.setQueryParams(`?title=${title}`);
        }
        return;
    }

    const handleAdvancedSubmit = (event) => {
        event.preventDefault();
        var query = ''
        if (titleAdvanced) {
            if (query) {
                query = query.concat(`&`)
            } else {
                query = query.concat('?')
            }
            query = query.concat(`title=${titleAdvanced}`)
        }
        if (username) {
            if (query) {
                query = query.concat(`&`)
            } else {
                query = query.concat('?')
            }
            query = query.concat(`username=${username}`)
        }
        if (sort) {
            console.log(sort)
            if (query) {
                query = query.concat(`&`)
            } else {
                query = query.concat('?')
            }
            query = query.concat(`sort=${sort}`)
        }
        if (cuisine) {
            if (query) {
                query = query.concat(`&`)
            } else {
                query = query.concat('?')
            }
            query = query.concat(`cuisine=${cuisine}`)
        }
        if (course) {
            if (query) {
                query = query.concat(`&`)
            } else {
                query = query.concat('?')
            }
            query = query.concat(`course=${course}`)
        }
        props.setQueryParams(query)
    }

    return (
        <div>
            <Form className="d-flex"
                onSubmit={handleSubmit}
                style={{
                    paddingTop: '0.5em',
                    paddingBottom: '0',

                }}>
                <Form.Group controlId='search'
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                    }}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="outline-success">Search</Button>
            </Form>
            <Accordion style={{
                paddingBottom: '0.5em',
                paddingTop: '0.5em',
            }}>
                <Accordion.Item eventKey="0" >
                    <Accordion.Header>Advanced Search</Accordion.Header>
                    <Accordion.Body >
                        <Form className="d-flex"
                            onSubmit={handleAdvancedSubmit}
                            style={{ paddingTop: '0', paddingBottom: '0.5em' }}>
                            <Container>
                                <Row xs='auto'>
                                    <Col>
                                        <Form.Group controlId='titleAdvanced' >
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="search"
                                                placeholder="Title"
                                                className='me-2'
                                                value={titleAdvanced}
                                                onChange={(e) => setTitleAdvanced(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='username'>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="search"
                                                placeholder="Username"
                                                className='me-2'
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='cuisine'>
                                            <Form.Label style={{ paddingTop: '0.5em' }}>Cuisine</Form.Label>
                                            <Form.Control
                                                type="search"
                                                placeholder="Cuisine"
                                                className='me-2'
                                                value={cuisine}
                                                onChange={(e) => setCuisine(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='course'>
                                            <Form.Label style={{ paddingTop: '0.5em' }}>Course</Form.Label>
                                            <Form.Control
                                                type="search"
                                                placeholder="Course"
                                                className='me-2'
                                                value={course}
                                                onChange={(e) => setCourse(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='sort'>
                                            <Form.Label style={{ paddingTop: '0.5em' }}>Sort Type</Form.Label>
                                            <Form.Select onChange={(e) => setSort(e.target.value)}>
                                                <option value="desc">Newest</option>
                                                <option value="asc">Oldest</option>
                                                <option value="popular">Most Popular</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row xs='auto' style={{ paddingTop: '0.5em', margin: 'auto', justifyContent: 'center' }}>
                                    <Col style={{ width: '100%' }}>
                                        <Button type="submit" style={{ width: '100%' }} variant="outline-success">Search</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    )
}