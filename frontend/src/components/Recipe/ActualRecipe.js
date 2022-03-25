import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ActualRecipe(props) {
    const [prep, setPrep] = useState();
    const [cook, setCook] = useState();
    const [total, setTotal] = useState();


    /*
    ** This function takes seconds as input and returns
    ** a string in the format x hours x minutes
    */
    function secondsToHms(seconds) {
        var result = ""
        seconds = Number(seconds);
        var h = Math.floor(seconds / 3600);
        var m = Math.floor(seconds % 3600 / 60);

        if (h !== 0) {
                result = result.concat(h.toString().slice(-2) + " h ")
        }
        if (m !== 0) {
                result = result.concat(m.toString().slice(-2) + " m ")
        }
        if(h === 0 && m === 0 ){
            result = '1 m'
        }
        return result
    }

    useEffect(() => {
        if (props?.recipe) {
            setPrep(secondsToHms(props.recipe.prep_time))
            setCook(secondsToHms(props.recipe.cook_time))
            setTotal(secondsToHms(props.recipe.prep_time + props.recipe.cook_time))
        }

    }, [props.recipe])


    return (
        <div>
            {props.recipe &&
                <Container style={{
                    paddingTop: '2%',
                    margin: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: '10%',
                    paddingRight: '10%'
                }}>
                    <Row>
                        <h3 style={{ paddingTop: '2%' }}>
                            {props.recipe.desc}
                        </h3>
                    </Row>
                    <Row xs="auto" style={{
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '2%'
                    }}>
                        <Col>
                            <h6>Prep:</h6>
                        </Col>
                        <Col style={{ paddingLeft: '0' }}>
                                <h6 style={{ fontStyle: 'italic' }}>{prep}</h6>
                        </Col>
                        <Col>
                            <h6>Cook:</h6>
                        </Col>
                        <Col style={{ paddingLeft: '0' }}>
                            <h6 style={{ fontStyle: 'italic' }}>{cook}</h6>
                        </Col>
                        <Col>
                            <h6>Total:</h6>
                        </Col>
                        <Col style={{ paddingLeft: '0' }}>
                            <h6 style={{ fontStyle: 'italic' }}>{total}</h6>
                        </Col>
                        <Col>
                            <h6>Serves: </h6>
                        </Col>
                        <Col style={{ paddingLeft: '0' }}>
                            <h6 style={{ fontStyle: 'italic' }}>{props.recipe.servings} </h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <h4>Ingredients</h4>
                            <Table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.recipe.ingredients.map((ingredient, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{ingredient.amount}</td>
                                                <td>{ingredient?.unit || ''}</td>
                                                <td>{ingredient.ingredient}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <h4>Steps</h4>
                            <Table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.recipe.steps.map((step, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{step}</td>
                                            </tr>)
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            }
        </div>

    )
}

