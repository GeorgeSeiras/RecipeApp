import {
    createPluginFactory,
    ELEMENT_IMAGE
} from '@udecode/plate'


export const customImagePlugin = createPluginFactory({
    key: ELEMENT_IMAGE,
    isElement: true,
    isVoid: true,
    then: (editor, { type }) => ({
        deserializeHtml: {
            rules: [
                {
                    validNodeName: 'IMG',
                },
            ],
            getNode: (el) => ({
                type,
                url: el.getAttribute('src'),
            }),
        },
    })
})