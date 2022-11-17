import React, {forwardRef, useRef} from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeSnippet = (props, ref) => {
    // console.log(props);
    const lineHeight = 19;
    const linesNumber = useRef(5 * lineHeight);
    if (props?.defaultValue) {
        linesNumber.current =
            Math.min(props.defaultValue.split(/\r\n|\r|\n/).length * lineHeight, 10 * lineHeight) +
            lineHeight * 3; //last line (+lineHeight) to remove the scroll bar
    }

    const handleOnMount = (editor, monaco) => {
        if (props?.readOnly) {
            editor.updateOptions({readOnly: true});
            // monacoEditorAttr.options.readOnly = true;
        } else {
            ref.current.snippet = editor;
        }
        // monacoEditorAttr.height = editor.getModel().getLineCount() * 19;
        // monacoEditorAttr.height = 100;
        // editor.layout();
    };

    const monacoEditorAttr = {
        height: linesNumber.current,
        defaultLanguage: 'javascript',
        theme: 'vs-dark',
        value: props.defaultValue,
        validate: true,
        automaticLayout: true,
        options: {
            scrollBeyondLastLine: false,
            selectOnLineNumbers: true,
            minimap: {enabled: false},
            padding: {top: 9, bottom: 9},
        },
        onMount: handleOnMount,
    };

    // console.log(monacoEditorAttr);

    return (
        <>
            {/* <h3>Snippet</h3> */}
            <div
                className='relative'
                ref={(el) => {
                    if (ref) {
                        ref.current.parent = el;
                    }
                }}
            >
                <MonacoEditor {...monacoEditorAttr} />
                <div className='error text-red-500 p-1 hidden'></div>
            </div>
        </>
    );
};

export default forwardRef(CodeSnippet);
