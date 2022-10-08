import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import {getSnipCode, setSnipCode} from '../../../tools/snipStore';

export default function Snippet(props) {
    const monacoEditorAttr = {
        // width: '300',
        height: '200',
        language: 'javascript',
        theme: 'vs-dark',
        value: props.value,
        options: {
            selectOnLineNumbers: true,
        },
        onChange: (value) => setSnipCode(value),
        // editorDidMount : HandleEditorMount,
    };

    return (
        <>
            {/* <h3>Snippet</h3> */}
            <div>
                <MonacoEditor {...monacoEditorAttr} />
            </div>
        </>
    );
}
