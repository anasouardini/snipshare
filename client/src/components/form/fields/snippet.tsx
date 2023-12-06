import React, { forwardRef, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { type RootState } from '../../../state/store';
import { useSelector } from 'react-redux';

interface Props {
  readOnly: boolean;
  setFieldValue: (name: string, value: any) => {};
  attr: {};
}
const CodeSnippet = (props: Props) => {
  const ref = React.useRef<{ snippet: {} }>({
    snippet: {},
  });

  const theme = useSelector((state: RootState) => state.userPreferences.theme);

  const lineHeight = 19;
  const linesNumber = useRef(5 * lineHeight);
  if (props.attr?.defaultValue) {
    linesNumber.current =
      Math.min(
        props.attr.defaultValue.split(/\r\n|\r|\n/).length * lineHeight,
        10 * lineHeight,
      ) +
      lineHeight * 3; //last line (+lineHeight) to remove the scroll bar
  }

  const handleOnMount = (editor: any) => {
    if (props?.readOnly) {
      editor.updateOptions({ readOnly: true });
      // monacoEditorAttr.options.readOnly = true;
    } else {
      ref.current.snippet = editor;
    }
    // console.log('sdlkfjsdl', editor);
    // monacoEditorAttr.height = editor.getModel().getLineCount() * 19;
    // monacoEditorAttr.height = 100;
    // editor.layout();
  };

  const handleBlur = (e) => {
    if (!props.readOnly) {
      props.setFieldValue(props.attr.name, ref.current.snippet.getValue());
    }
  };

  const monacoEditorAttr = {
    height: linesNumber.current,
    defaultLanguage: 'javascript',
    theme: `vs-${theme}`,
    value: props.attr.defaultValue,
    validate: true,
    automaticLayout: true,
    options: {
      scrollBeyondLastLine: false,
      selectOnLineNumbers: true,
      minimap: { enabled: false },
      padding: { top: 9, bottom: 9 },
    },
    onMount: handleOnMount,
  };

  // console.log(monacoEditorAttr);

  return (
    <>
      {/* <h3>Snippet</h3> */}
      <div onBlur={handleBlur} className='relative'>
        <MonacoEditor {...monacoEditorAttr} />
        <div className='error text-error p-1 hidden'></div>
      </div>
    </>
  );
};

export default CodeSnippet;
