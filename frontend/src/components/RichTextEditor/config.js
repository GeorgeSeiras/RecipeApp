import {
    CodeBlockElement,
    createPlateUI,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_PARAGRAPH,
  
    withProps,
  } from '@udecode/plate'
  import { css } from 'styled-components'
 
  
  export const CONFIG={
    editableProps: {
      spellCheck: false,
      autoFocus: false,
      placeholder: 'Type…',
      style: {
        padding: '15px',
      },
    },
    components: createPlateUI({
      [ELEMENT_CODE_BLOCK]: withProps(CodeBlockElement, {
        styles: {
          root: [
            css`
              background-color: #111827;
              code {
                color: white;
              }
            `,
          ],
        },
      }),
    }),
  
    align: {
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            ELEMENT_H1,
            ELEMENT_H2,
            ELEMENT_H3,
            ELEMENT_H4,
            ELEMENT_H5,
            ELEMENT_H6,
          ],
        },
      },
    },
   
  }
  