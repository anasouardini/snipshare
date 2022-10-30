import React from 'react';
import {useEffect} from 'react';
import {forwardRef} from 'react';
import MonacoEditor from 'react-monaco-editor';

const Snippet = forwardRef((props, ref) => {
    useEffect(() => {
        ref.current = {value: ''};
    }, []);

    const monacoEditorAttr = {
        height: '200',
        language: 'javascript',
        theme: 'vs-dark',
        value: props.defaultValue,
        options: {
            selectOnLineNumbers: true,
        },
        background: 0,
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
