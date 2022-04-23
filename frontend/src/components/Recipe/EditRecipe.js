import React, { useState, useEffect, useReducer, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import EditableRecipeBody from './EditableRecipeBody';
import { updateRecipe, deleteRecipeImages, updateRecipeState } from '../../actions/RecipeActions';
import { uploadRecipeImages } from '../../actions/RecipeActions';
import { UserContext } from '../Context/authContext';
import useError from '../ErrorHandler/ErrorHandler';
import { usePlateEditorRef } from '@udecode/plate-core';

import './editRecipe.css'
export default function EditRecipe(props) {

    const [title, setTitle] = useState(props?.recipe?.title || '');
    const [description, setDescription] = useState(props?.recipe?.desc || '');
    const [prepHours, setPrepHours] = useState(props?.recipe?.prepHours || '');
    const [prepMins, setPrepMins] = useState(props?.recipe?.prepMins || '');
    const [cookHours, setCookHours] = useState(props?.recipe?.cookHours || '');
    const [cookMins, setCookMins] = useState(props?.recipe?.cookMins || '');
    const [servings, setServings] = useState(props?.recipe?.servings || 0);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState(props?.recipe?.steps || ['']);
    const [thumbnail, setThumbnail] = useState(null);
    const [carousel, setCarousel] = useState([null]);
    const [course, setCourse] = useState(props?.recipe?.course || ['']);
    const [cuisine, setCuisine] = useState(props?.recipe?.cuisine || ['']);
    const [show, setShow] = useState(false);
    const {addError} = useError();
    const editor = usePlateEditorRef(2)

    const userData = useContext(UserContext);

    function secondsToHM(time) {
        const seconds = Number(time);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        return [h, m]
    }

    useEffect(() => {
        (async () => {
            setCarousel([]);
            if (props?.recipe) {
                props?.recipe?.images?.length > 0 &&
                    props?.recipe.images.forEach(async (image) => {
                        if (image.type === 'THUMBNAIL') {
                            setThumbnail(image.image);
                        } else if (image.type === 'GALLERY') {
                            setCarousel(carousel => [...carousel, image.image]);
                        }
                    })
                if (carousel.length !== 0) {
                    setCarousel(carousel => [...carousel, null])
                }
                const cookSeconds = Number(props.recipe.cook_time);
                const [cookHoursRes, cookMinsRes] = secondsToHM(cookSeconds);
                setCookHours(cookHoursRes);
                setCookMins(cookMinsRes);
                const prepSeconds = Number(props.recipe.prep_time);
                const [prepHoursRes, prepMinsRes] = secondsToHM(prepSeconds)
                setPrepHours(prepHoursRes);
                setPrepMins(prepMinsRes);
                const ingredientArray = [];
                props.recipe.ingredients.forEach((ingredient) => {
                    ingredientArray.push([ingredient.amount, ingredient.unit, ingredient.ingredient])
                })
                setIngredients(ingredientArray)
            }
        })()
    }, [props?.recipe])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {};
        payload['title'] = title;
        if (description !== '') {
            payload['desc'] = description;
        }
        payload['prep_time'] = ((prepMins !== '' ? parseInt(prepMins) * 60 : 0)
            + (prepHours !== '' ? parseInt(prepHours) * 60 * 60 : 0));
        payload['cook_time'] = ((cookMins !== '' ? parseInt(cookMins) * 60 : 0)
            + (cookHours !== '' ? parseInt(cookHours) * 60 * 60 : 0));

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
        const imagesToDelete = [];
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

        const oldImages = new Map();
        props.recipe.images.forEach((image, index) => {
            oldImages.set(image.image, image);
        })
        const toDelete = []
        let i = 0;
        images.forEach((value) => {
            if (value.image instanceof File) {
                form.append(`images[${i}].image`, value['image']);
                form.append(`images[${i}].type`, value['type']);
                i++;
            } else {
                const found = oldImages.get(value.image)
                if (found) {
                    oldImages.delete(value.image)
                }
            }
        })

        oldImages.forEach(image => {
            toDelete.push(image.id)
        })
        if (toDelete.length > 0) {
            const deleteImagesResponse = await deleteRecipeImages(props.dispatch, { 'images': toDelete }, userData.user.token.key, props.recipe.id);
            if (!deleteImagesResponse?.result) {
                addError('Error while modifying images')
            }
        }
        const imageResponse = await uploadRecipeImages(props.dispatch, form, userData.user.token.key, props.recipe.id);
        const recipeResponse = await updateRecipe(props.dispatch, payload, userData.user.token.key, props.recipe.id);
        if (!imageResponse?.result) {
           addError('Error while modifying images')
        }
        if (recipeResponse?.result) {
            setShow(false)
            // window.location.reload()
        }
    }

    return (
        <Container style={{ width: 'auto', paddingRight: '0', marginRight: '0' }}>

            <Button size='sm' onClick={() => setShow(true)} >
                EDIT
            </Button>
            <Modal show={show} onHide={() => setShow(false)} enforceFocus={false}>
                <Modal.Header closeButton />
                <Modal.Title style={{textAlign:'center'}}>Edit Recipe</Modal.Title>
                <Modal.Body >
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <EditableRecipeBody title={title} setTitle={setTitle} description={description} setDescription={setDescription} prepHours={prepHours} setPrepHours={setPrepHours}
                            prepMins={prepMins} setPrepMins={setPrepMins} cookHours={cookHours} setCookHours={setCookHours} cookMins={cookMins} setCookMins={setCookMins} servings={servings} setServings={setServings} ingredients={ingredients}
                            setIngredients={setIngredients} steps={steps} setSteps={setSteps} thumbnail={thumbnail} setThumbnail={setThumbnail} carousel={carousel} setCarousel={setCarousel}
                            course={course} setCourse={setCourse} cuisine={cuisine} setCuisine={setCuisine} />
                        <Button type='submit'>
                            Edit Recipe
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}