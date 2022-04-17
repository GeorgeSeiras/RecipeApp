import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';

const API_URL = process.env.REACT_APP_API_URL

export function CustomEditor(props) {
    const config = {

        ckfinder: {
            uploadUrl: `${API_URL}/image/upload`
        },
        language: 'en'
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CKEditor
                editor={Editor}
                config={config}
                data={props.description}
                onChange={(event, editor) => {
                    const data = editor.getData()
                    props.setDescription(data)
                }}
            />
        </div>
    )
}