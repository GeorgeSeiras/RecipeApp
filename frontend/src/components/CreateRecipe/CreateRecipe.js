import React, { useState, useReducer, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';

import { CreateRecipeReducer, UploadImageReducer, DeleteRecipeReducer } from './reducer';
import { createRecipe, uploadRecipeImages, deleteRecipe } from './actions';
import { UserContext } from '../Context/authContext';
import EditableRecipeBody from '../Recipe/EditableRecipeBody';

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
            onSubmit={(e) => handleSubmit(e)}
        >
            <EditableRecipeBody title={title} setTitle={setTitle} description={description} setDescription={setDescription} prepHours={prepHours} setPrepHours={setPrepHours}
                prepMins={prepMins} setPrepMins={setPrepMins} cookHours={cookHours} setCookHours={setCookHours} cookMins={cookMins} setCookMins={setCookMins} servings={servings} setServings={setServings} ingredients={ingredients}
                setIngredients={setIngredients} steps={steps} setSteps={setSteps} thumbnail={thumbnail} setThumbnail={setThumbnail} carousel={carousel} setCarousel={setCarousel}
                course={course} setCourse={setCourse} cuisine={cuisine} setCuisine={setCuisine} />

            <Button variant="success" type="submit" disabled={!validateForm()}>
                Create Recipe
            </Button>
        </Form >
    );
}