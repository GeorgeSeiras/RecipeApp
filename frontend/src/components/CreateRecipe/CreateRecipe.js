import React, { useState, useReducer, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import UploadImageCard from './UploadImageCard';
import { useNavigate } from 'react-router-dom';

import { CreateRecipeReducer, UploadImageReducer, DeleteRecipeReducer } from './reducer';
import { createRecipe, uploadRecipeImages, deleteRecipe } from './actions';
import { UserContext } from '../Context/authContext';
import './CreateRecipe.css';

export default function CreateRecipe() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prepHours, setPrepHours] = useState('');
    const [prepMins, setPrepMins] = useState('');
    const [cookHours, setCookHours] = useState('');
    const [cookMins, setCookMins] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState([['', '', '']]);
    const [steps, setSteps] = useState(['']);
    const [thumbnail, setThumbnail] = useState(null);
    const [carousel, setCarousel] = useState([null]);
    const [course, setCourse] = useState(['']);
    const [cuisine, setCuisine] = useState(['']);

    const [state, dispatch] = useReducer(CreateRecipeReducer);
    const [stateImages, dispatchImages] = useReducer(UploadImageReducer);
    const [stateDelete, dispatchDelete] = useReducer(DeleteRecipeReducer);

    const userData = useContext(UserContext);

    const navigate = useNavigate();

    const updateIngredients = (row, col, value) => {
        var copy = ingredients.map(function (arr) {
            return arr.slice();
        });
        copy[row][col] = value;
        setIngredients(copy)
    }
    const removeIngredientRow = (index) => {
        var copy = ingredients.map(function (arr) {
            return arr.slice();
        });
        copy.splice(index, 1);
        setIngredients(copy);
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
    const validateForm = () => {
        if (title === "") {
            return false;
        }
        if (prepHours === "" && prepMins === "") {
            return false;
        }
        if (cookHours === "" && cookMins === "") {
            return false;
        }
        if (servings === '') {
            return false
        }
        if (!ingredients.some(ingredient =>
            ingredient[2] !== '')
        ) {
            return false;

        }
        if (steps.length < 1 || !steps.some(elem => elem !== "")) {
            return false;
        }
        if (cuisine.length < 1 || !cuisine.some(elem => elem !== "")) {
            return false;
        }
        if (course.length < 1 || !course.some(elem => elem !== "")) {
            return false;
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {};
        payload['title'] = title;
        if (description !== '') {
            payload['desc'] = description;
        }
        payload['prep_time'] = prepMins !== '' ? parseInt(prepMins) * 60 : 0
            + prepHours !== '' ? parseInt(prepHours) * 60 * 60 : 0;
        payload['cook_time'] = cookMins !== '' ? parseInt(cookMins) * 60 : 0
            + cookHours !== '' ? parseInt(cookHours) * 60 * 60 : 0;
        payload['servings'] = servings;
        payload['steps'] = steps.filter(step => {
            return step !== '';
        });
        payload['course'] = course.filter(course => {
            return course !== '';
        });
        payload['cuisine'] = cuisine.filter(cuisine => {
            return cuisine !== '';
        })

        payload['ingredients'] = ingredients.filter(ingredient => ingredient[2] !== '')
            .map(ingredient => {
                return ({
                    'amount': ingredient[0],
                    'unit': ingredient[1],
                    'ingredient': ingredient[2]
                })
            })

        const images = []
        if (thumbnail !== null) {
            images.push({ 'image': thumbnail, 'type': 'THUMBNAIL' })
        }
        if (carousel.length > 1 || carousel[0] !== null) {
            carousel.forEach(image => {
                if (image !== null) {
                    images.push({ 'image': image, 'type': 'GALLERY' })
                }
            })
        }
        const form = new FormData();
        images.forEach((value, index) => {
            form.append(`images[${index}].image`, value['image'])
            form.append(`images[${index}].type`, value['type'])

        })
        for (var pair of form.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }
        const recipeResponse = await createRecipe(dispatch, payload, userData.user.token.key);
        if (recipeResponse?.result) {
            const imageResponse = await uploadRecipeImages(dispatchImages, form, userData.user.token.key, recipeResponse.result.recipe.id);
            if (imageResponse?.result) {
                navigate(`/recipe/${recipeResponse.result.recipe.id}`)
            } else {
                const deleteResponse = await deleteRecipe(dispatchDelete, recipeResponse.result.recipe.id, userData.user.token.key)
                if (deleteResponse?.status === 'ok') {
                    //show error message about problem with the images
                    console.log('Recipe deleted')
                }
            }
        }
    }
    return (
        <Form style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 13rem'
        }}
            onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className='mb-3' >
                <Form.Label column>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Thumbnail</Form.Label>
                <UploadImageCard images={thumbnail} setImages={setThumbnail} type={'single'} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Carousel Images</Form.Label>
                <UploadImageCard images={carousel} setImages={setCarousel} type={'many'} />
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

            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Course</Form.Label>
                        {course.map((element, index) => {
                            return (
                                <Row className="mb-3" key={index} id={index}>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="course"
                                            value={element}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, course, setCourse)} />
                                    </Col>
                                    <Col>
                                        <Button onClick={((e) => { removeRowFromArray(e.target.parentNode.id, course, setCourse) })}
                                            variant="outline-danger">
                                            x
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        })}
                        {
                            course.length < 5 &&
                            <Col>
                                <Button variant="success" className="mb-3"
                                    onClick={(e) => { setCourse([...course, '']) }}>
                                    +
                                </Button>
                            </Col>
                        }
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Cuisine</Form.Label>
                        {cuisine.map((element, index) => {
                            return (
                                <Row className="mb-3" key={index} id={index}>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="cuisine"
                                            value={element}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, cuisine, setCuisine)} />
                                    </Col>
                                    <Col>
                                        <Button onClick={((e) => { removeRowFromArray(e.target.parentNode.id, cuisine, setCuisine) })}
                                            variant="outline-danger">
                                            x
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        })}
                        {
                            cuisine.length < 5 &&
                            <Col>
                                <Button variant="success" className="mb-3"
                                    onClick={(e) => { setCuisine([...cuisine, '']) }}>
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
                        value={prepHours}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => setPrepHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={prepMins}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
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
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => setCookHours(e.target.value)} />
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        placeholder="minutes"
                        value={cookMins}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
                        onChange={(e) => setCookMins(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label column>Servings</Form.Label>
                <Form.Control
                    type='number'
                    placeholder='servings'
                    value={servings}
                    onInput={(e) => e.target.value = e.target.value.replace(/\D+/g, '')}
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
                                <tr key={index} id={index} >
                                    <td key={0} style={{ width: '1em' }}>
                                        <Form.Control
                                            readOnly='readonly'
                                            type="text"
                                            value={index} />
                                    </td>
                                    <td key={1}>
                                        <Form.Control
                                            type="text"
                                            placeholder="step"
                                            value={step}
                                            onChange={(e) => updateArray(e.target.parentNode.parentNode.id, e.target.value, steps, setSteps)} />
                                    </td>
                                    <td>
                                        <Button variant="outline-danger" onClick={((e) => { removeRowFromArray(e.target.parentNode.parentNode.id, steps, setSteps) })}>
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

            <Button variant="success" type="submit" disabled={!validateForm()}>
                Create Recipe
            </Button>
        </Form >
    );
}