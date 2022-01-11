import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ActualRecipe(props) {

    return (
        <Container>
            {props.recipe?.ingredients &&
                <Col>
                    <h4>Ingredients</h4>
                    <Table>
                        <thead>
                            <th></th>
                            <th></th>
                            <th></th>
                        </thead>
                        <tbody>
                            {props.recipe.ingredients.map((ingredient) => {
                                return (
                                    <tr>
                                        <td>{ingredient.amount}</td>
                                        <td>{ingredient?.unit}</td>
                                        <td>{ingredient.ingredient}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Col>}
        </Container>
    )
}

