import { createPluginFactory,onKeyDownToggleElement } from '@udecode/plate'
import {Library} from '../MediaLibrary/Library';

const createCustomImagePlugin = createPluginFactory({
    key: 'ELEMENT_CUSTOM_IMAGE'
})

export const imagePlugin = createCustomImagePlugin({
    key: 'img',
    type: 'image',
    isElement:true,
    component: Library,
    handlers:{
        onKeyDown:onKeyDownToggleElement
    }
})