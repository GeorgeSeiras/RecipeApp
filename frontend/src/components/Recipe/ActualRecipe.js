import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    createPlateUI,
    Plate,
    createBlockquotePlugin,
    createBoldPlugin,
    createCodePlugin,
    createHeadingPlugin,
    createHighlightPlugin,
    createKbdPlugin,
    createItalicPlugin,
    createLinkPlugin,
    createListPlugin,
    createMediaEmbedPlugin,
    createNodeIdPlugin,
    createParagraphPlugin,
    createDndPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createTablePlugin,
    createTodoListPlugin,
    createUnderlinePlugin,
    createComboboxPlugin,
    createMentionPlugin,
    createFontColorPlugin,
    createFontBackgroundColorPlugin,
    createDeserializeMdPlugin,
    createDeserializeCsvPlugin,
    createFontSizePlugin,
    createHorizontalRulePlugin,
    createPlugins,
    createDeserializeDocxPlugin,
    createJuicePlugin,
    createAlignPlugin,

} from '@udecode/plate'
import { CONFIG } from '../RichTextEditor/config'

import { customImagePlugin } from '../RichTextEditor/CustomImagePlugin';

export default function ActualRecipe(props) {
    const [prep, setPrep] = useState();
    const [cook, setCook] = useState();
    const [total, setTotal] = useState();
    const plugins = createPlugins([
        createParagraphPlugin(),
        createBlockquotePlugin(),
        createTodoListPlugin(),
        createHeadingPlugin(),
        createHorizontalRulePlugin(),
        createLinkPlugin(),
        createListPlugin(),
        createTablePlugin(),
        createMediaEmbedPlugin(),
        createBoldPlugin(),
        createCodePlugin(),
        createItalicPlugin(),
        createHighlightPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createSubscriptPlugin(),
        createSuperscriptPlugin(),
        createFontColorPlugin(),
        createFontBackgroundColorPlugin(),
        createFontSizePlugin(),
        createKbdPlugin(),
        createNodeIdPlugin(),
        createDndPlugin(),
        createComboboxPlugin(),
        createMentionPlugin(),
        createDeserializeMdPlugin(),
        createDeserializeCsvPlugin(),
        createDeserializeDocxPlugin(),
        createJuicePlugin(),
        createAlignPlugin(CONFIG.align),
        customImagePlugin()
    ], {
        // Plate components
        components: createPlateUI(),
    });

    /*
    ** This function takes seconds as input and returns
    ** a string in the format x hours x minutes
    */
    function secondsToHms(seconds) {
        var result = ""
        const secs = Number(seconds);
        var h = Math.floor(secs / 3600);
        var m = Math.floor(secs % 3600 / 60);

        if (h !== 0) {
            if (h === 1) {
                result = result.concat(h.toString().slice(-2) + " hour ")
            } else {
                result = result.concat(h.toString().slice(-2) + " hours ")
            }
        }
        if (m !== 0) {
            if (m === 1) {
                result = result.concat(m.toString().slice(-2) + " minute ")
            } else {
                result = result.concat(m.toString().slice(-2) + " minutes ")
            }
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
            {props?.recipe &&
                <Container style={{
                    paddingTop: '2%',
                    margin: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: '5%',
                    paddingRight: '5%'
                }}>
                    <Row>
                        <Plate
                            id='2'
                            initialValue={props?.recipe?.desc || [{ children: [{ text: '', },], },]}
                            editableProps={{
                                readOnly: true,
                            }}
                            plugins={plugins}
                        >
                        </Plate>

                    </Row>
                    <Row xs={'auto'} style={{
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '2%'
                    }}>
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
                    <Row xs={'auto'} style={{
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
                                                <td style={{ width: '50px' }}>{index}</td>
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

