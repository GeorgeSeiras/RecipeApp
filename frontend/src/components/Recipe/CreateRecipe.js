import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function CreateRecipe() {
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [prepHours, setPrepHours] = useState();
    const [prepMins, setPrepMins] = useState();
    const [cookHours, setCookHours] = useState();
    const [cookMins, setCookMins] = useState();
    const [servings, setServings] = useState();
    const [ingredients, setIngredients] = useState([['', '', '']]);
    const [steps, setSteps] = useState(['']);

    const updateIngredients = (row, col, value) => {
        var copy = ingredients.map(function (arr) {
            return arr.slice();
        });
        copy[row][col] = value;
        setIngredients(copy)
    }

    const updateSteps = (index, value) => {
        var copy = [...steps];
        copy[index] = value;
        setSteps(copy);
    }

    const removeIngredientRow = (index) => {
        var copy = ingredients.map(function (arr) {
            return arr.slice();
        });
        copy.splice(index, 1);
        setIngredients(copy);
    }

    const removeStepRow = (index) => {
        var copy = [...steps]
        copy.splice(index, 1);
        setSteps(copy);
    }
    return (
        <Form style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 13rem'
        }}>
            <Form.Group className='mb-3' >
                <Form.Label column>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={9} maxLength='500'
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3" as={Row}>
                <Form.Label>Prep Time</Form.Label>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="hours"
                        value={prepHours}
                        onKeyDown={(e) => typeof e.key === 'string' && e.preventDefault()}
                        onChange={(e) => setPrepHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={prepMins}
                        onKeyDown={(e) => typeof e.key === 'string' && e.preventDefault()}
                        onChange={(e) => setPrepMins(e.target.value)} />
                </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row}>
                <Form.Label>Cook Time</Form.Label>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="hours"
                        value={cookHours}
                        onKeyDown={(e) => typeof e.key === 'string' && e.preventDefault()}
                        onChange={(e) => setCookHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={cookMins}
                        onKeyDown={(e) => typeof e.key === 'string' && e.preventDefault()}
                        onChange={(e) => setCookMins(e.target.value)} />
                </Col>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label column>Servings</Form.Label>
                <Form.Control
                    type='number'
                    placeholder='servings'
                    value={servings}
                    onKeyDown={(e) => typeof e.key === 'string' && e.preventDefault()}
                    onChange={(e) => setServings(e.target.value)} />
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
                        {ingredients?.map((ingredient, index) => {
                            return (
                                <tr key={index} id={index}>
                                    <td key={0}>
                                        <Form.Control
                                            type="text"
                                            placeholder="amount"
                                            value={ingredient[0]}
                                            onChange={(e) => updateIngredients(e.target.parentNode.parentNode.id, 0, e.target.value)} />
                                    </td>
                                    <td key={1}>
                                        <Form.Control
                                            type="text"
                                            placeholder="unit"
                                            value={ingredient[1]}
                                            onChange={(e) => updateIngredients(e.target.parentNode.parentNode.id, 1, e.target.value)} />
                                    </td>
                                    <td key={2}>
                                        <Form.Control
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
                                    setIngredients([...ingredients, ['', '', '']])
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
                        {steps?.map((step, index) => {
                            return (
                                <tr key={index} id={index}>
                                    <td key={0}>
                                        <Form.Control
                                            readOnly='readonly'
                                            type="text"
                                            placeholder="amount"
                                            value={index} />
                                    </td>
                                    <td key={1}>
                                        <Form.Control
                                            type="text"
                                            placeholder="step"
                                            value={step}
                                            onChange={(e) => updateSteps(e.target.parentNode.parentNode.id, e.target.value)} />
                                    </td>
                                    <td>
                                        <Button variant="outline-danger" onClick={((e) => { removeStepRow(e.target.parentNode.parentNode.id) })}>
                                            x
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr key={'newRow'}>
                            <td>
                                <Button variant="success" onClick={(() => {
                                    setSteps([...steps, ''])
                                })}>
                                    +
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Form.Group >
        </Form >
    );
}