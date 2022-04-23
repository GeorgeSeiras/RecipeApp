import React from 'react'
import {
    createPlateUI,
    HeadingToolbar,
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
import { ToolbarButtons } from './SlateToolbar'
import { CONFIG } from './config'
import { customImagePlugin } from './CustomImagePlugin'

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

const initialValue = [

    {
        children: [
            {
                text:
                    '',
            },
        ],
    },
];

export default function CustomEditor(props) {
    return (
        <div style={{ border: 'solid 1px',paddingLeft:'1.5em',paddingRight:'1.5em',minHeight:'500x'}}>
            <Plate
                id='1'
                initialValue={props?.description || initialValue}
                onChange={(newValue) => { props.setDescription(newValue) }}
                plugins={plugins}
            >
                <HeadingToolbar>
                    <ToolbarButtons />
                </HeadingToolbar>

            </Plate>
        </div>
    )
}