import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown'

export default function SearchBar(props) {

    const [title, setTitle] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [course, setCourse] = useState('');
    const [username, setUsername] = useState('');
    const [sort, setSort] = useState();
    const [titleAdvanced, setTitleAdvanced] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(title);
        // payload.forEach((key, value, index) => {
        //     if (index === 0) {
        //         queryParams = queryParams.concat(`?${key}=${value}`)
        //     } else {
        //         queryParams = queryParams.concat(`&${key}=${value}`)
        //     }
        // })
    }

    const handleAdvancedSubmit = (event) => {
        event.preventDefault();
    }

    const changeExpand = (event) => {
        console.log(open)
        setOpen(!open);
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
                <Button variant="outline-success">Search</Button>
            </Form>
            <Accordion style={{ paddingBottom: '0.5em', paddingTop: '0.5em' }}>
                <Accordion.Item eventKey="0" >
                    <Accordion.Header >Advanced Search</Accordion.Header>
                    <Accordion.Body >
                        <Form className="d-flex" onSubmit={handleAdvancedSubmit} style={{ paddingTop: '0', paddingBottom: '0.5em' }}>
                            <Form.Group controlId='titleAdvanced'>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Title"
                                    className='me-2'
                                    value={titleAdvanced}
                                    onChange={(e) => setTitleAdvanced(e.target.value)}
                                />
                            </Form.Group>
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
                            <Form.Group controlId='cuisine'>
                                <Form.Label>Cuisine</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Cuisine"
                                    className='me-2'
                                    value={cuisine}
                                    onChange={(e) => setCuisine(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId='course'>
                                <Form.Label>Course</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Course"
                                    className='me-2'
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId='sort'>
                                <Form.Label>Sort</Form.Label>
                                <Dropdown >
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Sort Type
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="desc">Newest</Dropdown.Item>
                                        <Dropdown.Item eventKey="asc">Ascending</Dropdown.Item>
                                        <Dropdown.Item eventKey="popular">Most Popular</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Form>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    )
}