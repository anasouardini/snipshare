import React from 'react';
import {forwardRef} from 'react';
import MonacoEditor from 'react-monaco-editor';

const Snippet = forwardRef((props, ref) => {
    const monacoEditorAttr = {
        width: '300',
        height: '200',
        language: 'javascript',
        theme: 'vs-dark',
        value: props.value,
        options: {
            selectOnLineNumbers: true,
        },
        onChange: (value) => {
            ref.current = {value};
            // console.log('snippetVal', ref.current);
        },
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
});

export default Snippet;
