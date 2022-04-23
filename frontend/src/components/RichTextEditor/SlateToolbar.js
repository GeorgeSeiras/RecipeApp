import React, { useState, useRef } from 'react'
import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt'
import { Subscript } from '@styled-icons/foundation/Subscript'
import { Superscript } from '@styled-icons/foundation/Superscript'
import { FormatAlignCenter } from '@styled-icons/material/FormatAlignCenter'
import { FormatAlignJustify } from '@styled-icons/material/FormatAlignJustify'
import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft'
import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight'
import { FormatBold } from '@styled-icons/material/FormatBold'
import { FormatIndentDecrease } from '@styled-icons/material/FormatIndentDecrease'
import { FormatIndentIncrease } from '@styled-icons/material/FormatIndentIncrease'
import { FormatItalic } from '@styled-icons/material/FormatItalic'
import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted'
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered'
import { FormatQuote } from '@styled-icons/material/FormatQuote'
import { FormatStrikethrough } from '@styled-icons/material/FormatStrikethrough'
import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined'
import { Looks3 } from '@styled-icons/material/Looks3'
import { Looks4 } from '@styled-icons/material/Looks4'
import { Looks5 } from '@styled-icons/material/Looks5'
import { Looks6 } from '@styled-icons/material/Looks6'
import { LooksOne } from '@styled-icons/material/LooksOne'
import { LooksTwo } from '@styled-icons/material/LooksTwo'


import Button from 'react-bootstrap/Button'
import image_upload from '../../static/image_upload.svg';
import Image from 'react-bootstrap/Image';
import Overlay from 'react-bootstrap/Overlay';

import { Library } from '../MediaLibrary/Library'

import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_OL,
  ELEMENT_UL,
  ELEMENT_IMAGE,
  getPluginType,
  getPreventDefaultHandler,
  indent,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
  outdent,
  AlignToolbarButton,
  ToolbarButton,
  BlockToolbarButton,
  ListToolbarButton,
  MarkToolbarButton,
  usePlateEditorRef,
  insertNodes
} from '@udecode/plate'

export const BasicElementToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<LooksOne />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<Looks3 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H4)}
        icon={<Looks4 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H5)}
        icon={<Looks5 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H6)}
        icon={<Looks6 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </>
  )
}

export const IndentToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(outdent, editor)}
        icon={<FormatIndentDecrease />}
      />
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(indent, editor)}
        icon={<FormatIndentIncrease />}
      />
    </>
  )
}

export const ListToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
    </>
  )
}

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeft />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenter />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRight />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustify />} />
    </>
  )
}

export const BasicMarkToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_CODE)}
        icon={<CodeAlt />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_SUPERSCRIPT)}
        clear={getPluginType(editor, MARK_SUBSCRIPT)}
        icon={<Superscript />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_SUBSCRIPT)}
        clear={getPluginType(editor, MARK_SUPERSCRIPT)}
        icon={<Subscript />}
      />
    </>
  )
}

const CustomImageUploadButton = ({ id, getImageUrl, ...props }) => {
  const [show, setShow] = useState(false)
  const target = useRef(null);
  const editor = usePlateEditorRef(id)

  const handleInsertImage = async (event) => {
    if (!editor) return;
    event.preventDefault();
    const url = event.target.src;
    const text = { text: '' }
    const image = [
      {
        type: getPluginType(editor, ELEMENT_IMAGE),
        url,
        children: [text],
      },
      {
        type: getPluginType(editor, ELEMENT_PARAGRAPH),
        children: [text]
      }
    ];

    insertNodes(editor, image)
    setShow(false)
  }

  return (

    <>
      <Button ref={target} onClick={() => setShow(!show)}
        style={{
          backgroundColor: 'white',
          border: 'none',
          paddingTop: '0',
          paddingLeft: '10px'
        }}
        {...props}
      >
        <Image
          src={image_upload}
          alt='image_upload'
          width='20px'
        />
      </Button>
      <Overlay target={target.current} show={show} >
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'black',
              borderRadius: 3,
              ...props.style,
            }}
          >
            <Library handleInsertImage={handleInsertImage} />
          </div>
        )}
      </Overlay>

    </>
  )

}

export const ToolbarButtons = () => (
  <>
    <BasicElementToolbarButtons />
    <ListToolbarButtons />
    <BasicMarkToolbarButtons />
    <AlignToolbarButtons />
    <CustomImageUploadButton />
  </>
)
