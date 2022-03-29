import React, { useState, useReducer, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import UploadImageCard from '../CreateRecipe/UploadImageCard';

import './CreateRecipe.css';

export default function EditableRecipeBody(props) {

    const updateIngredients = (row, col, value) => {
        var copy = props.ingredients.map(function (arr) {
            return arr.slice();
        });
        copy[row][col] = value;
        props.setIngredients(copy)
    }
    const removeIngredientRow = (index) => {
        var copy = props.ingredients.map(function (arr) {
            return arr.slice();
        });
        copy.splice(index, 1);
        props.setIngredients(copy);
    }

    const removeRowFromArray = (index, array, setter) => {
        var copy = [...array];
        copy.splice(index, 1);
        setter(copy);
    }

    const updateArray = (index, value, array, setter) => {
        var copy = [...array];
        copy[index] = value;
        setter(copy);
    }
    return (
        <Container>
            <Form.Group className='mb-3' >
                <Form.Label column>Title</Form.Label>
                <Form.Control
                    maxLength='50'
                    type="text"
                    placeholder="Title"
                    value={props.title}
                    onChange={(e) => props.setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Thumbnail</Form.Label>
                <UploadImageCard images={props.thumbnail} setImages={props.setThumbnail} type={'single'} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Carousel Images</Form.Label>
                <UploadImageCard images={props.carousel} setImages={props.setCarousel} type={'many'} />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={9} maxLength='500'
                    type="text"
                    placeholder="Description"
                    value={props.description}
                    onChange={(e) => props.setDescription(e.target.value)}
                />
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Course</Form.Label>
                        {props.course.map((element, index) => {
                            return (
                                <Row className="mb-3" key={index} id={index}>
                                    <Col>
                                        <Form.Control
                                            maxLength='30'
                                            type="text"
                                            placeholder="course"
                                            value={element}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, props.course, props.setCourse)} />
                                    </Col>
                                    <Col>
                                        <Button onClick={((e) => { removeRowFromArray(e.target.parentNode.id, props.course, props.setCourse) })}
                                            variant="outline-danger">
                                            x
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        })}
                        {
                            props.course.length < 5 &&
                            <Col>
                                <Button variant="success" className="mb-3"
                                    onClick={(e) => { props.setCourse([...props.course, '']) }}>
                                    +
                                </Button>
                            </Col>
                        }
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Cuisine</Form.Label>
                        {props.cuisine.map((element, index) => {
                            return (
                                <Row className="mb-3" key={index} id={index}>
                                    <Col>
                                        <Form.Control
                                            maxLength='30'
                                            type="text"
                                            placeholder="cuisine"
                                            value={element}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, props.cuisine, props.setCuisine)} />
                                    </Col>
                                    <Col>
                                        <Button onClick={((e) => { removeRowFromArray(e.target.parentNode.id, props.cuisine, props.setCuisine) })}
                                            variant="outline-danger">
                                            x
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        })}
                        {
                            props.cuisine.length < 5 &&
                            <Col>
                                <Button variant="success" className="mb-3"
                                    onClick={(e) => { props.setCuisine([...props.cuisine, '']) }}>
                                    +
                                </Button>
                            </Col>
                        }
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3" as={Row}>
                <Form.Label>Prep Time</Form.Label>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="hours"
                        value={props.prepHours}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => props.setPrepHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={props.prepMins}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => props.setPrepMins(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group className="mb-3" as={Row}>
                <Form.Label>Cook Time</Form.Label>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="hours"
                        value={props.cookHours}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => props.setCookHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={props.cookMins}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => props.setCookMins(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label column>Servings</Form.Label>
                <Form.Control
                    type='number'
                    placeholder='servings'
                    value={props.servings}
                    onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                    onChange={(e) => props.setServings(e.target.value)} />
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label>Ingredients</Form.Label>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.ingredients?.map((ingredient, index) => {
                            return (
                                <tr key={index} id={index}>
                                    <td key={0}>
                                        <Form.Control
                                            maxLength='15'
                                            type="text"
                                            placeholder="amount"
                                            value={ingredient[0]}
                                            onChange={(e) => updateIngredients(e.target.parentNode.parentNode.id, 0, e.target.value)} />
                                    </td>
                                    <td key={1}>
                                        <Form.Control
                                            maxLength='15'
                                            type="text"
                                            placeholder="unit"
                                            value={ingredient[1]}
                                            onChange={(e) => updateIngredients(e.target.parentNode.parentNode.id, 1, e.target.value)} />
                                    </td>
                                    <td key={2}>
                                        <Form.Control
                                            maxLength='50'
                                            type="text"
                                            placeholder="ingredient"
                                            value={ingredient[2]}
                                            onChange={(e) => updateIngredients(e.target.parentNode.parentNode.id, 2, e.target.value)} />
                                    </td>
                                    <td key={3}>
                                        <Button onClick={((e) => { removeIngredientRow(e.target.parentNode.parentNode.id) })} variant="outline-danger">
                                            x
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr key={'newRow'}>
                            <td>
                                <Button variant="success" onClick={(() => {
                                    props.setIngredients([...props.ingredients, ['', '', '']])
                                })}>
                                    +
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.steps?.map((step, index) => {
                            return (
                                <tr key={index} id={index} >
                                    <td key={0} style={{ width: '1em' }}>
                                        <Form.Control
                                            readOnly='readonly'
                                            type="text"
                                            value={index} />
                                    </td>
                                    <td key={1}>
                                        <Form.Control
                                            maxLength='200'
                                            type="text"
                                            placeholder="step"
                                            value={step}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, props.steps, props.setSteps)} />
                                    </td>
                                    <td>
                                        <Button variant="outline-danger" onClick={((e) => { removeRowFromArray(e.target.parentNode.parentNode.id, props.steps, props.setSteps) })}>
                                            x
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr key={'newRow'}>
                            <td>
                                <Button variant="success" onClick={(() => {
                                    props.setSteps([...props.steps, ''])
                                })}>
                                    +
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Form.Group >
        </Container >
    );
}