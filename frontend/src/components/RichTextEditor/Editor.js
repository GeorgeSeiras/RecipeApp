import React, { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import './Editor.css'
const API_URL = process.env.REACT_APP_API_URL

export default function CustomEditor(props) {
    const config = {
        simpleUpload: {
            uploadUrl: `${API_URL}/image/upload`
        },
        language: 'en'
    }

    return (
        <div style={{display:'flex',justifyContent:'center',paddingBottom:'0.5em'}}>
            <CKEditor 
            rows={5}
                editor={Editor}
                config={config}
                state={props?.description || ''}
                data={props.description}
                onChange={(event, editor) => {
                    const data = editor.getData()
                    props.setDescription(data)
                }}
            />
        </div>
    )
}
