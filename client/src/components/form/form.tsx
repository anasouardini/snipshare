import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { create, update } from '../../tools/bridge';
import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';

// FIELDS
import IsPrivate from './fields/isPrivate';
import CodeSnippet from './fields/snippet';
import Categories from './fields/categories';
import Language from './fields/language';

import { useFormik, Formik, Form, Field } from 'formik';

const fieldsMap = {
  IsPrivate,
  CodeSnippet,
  Categories,
  Language,
};
function getFieldsMapTG(type: string): type is keyof typeof fieldsMap {
  return type in fieldsMap;
}
const getFieldsMap = (type: fieldsTypesT) => {
  if (getFieldsMapTG(type)) {
    // only returns react functions
    // console.log(`jsx com (${type}): `, fieldsMap[type]);
    const holder = fieldsMap[type];
    return holder;
  }

  // console.log(`built-in dom (${type}: `, type);
  // only returns built-in dom elements
  return type;
};

type fieldsTypesT =
  | 'title'
  | 'descr'
  | 'CodeSnippet'
  | 'Categories'
  | 'IsPrivate'
  | 'Language';
type fieldsKeysT =
  | 'title'
  | 'descr'
  | 'snippet'
  | 'categories'
  | 'isPrivate'
  | 'language';

type formPropsT = {
  action: string;
  validationSchema: Object;
  fields: [
    {
      type: fieldsTypesT;
      attr: {
        key: fieldsKeysT;
        type: string;
        name?: string;
        placeHolder?: string;
      };
    },
  ];
  hidePopUp: () => undefined;
  owner: string | undefined;
  refetch: any;
  snipId: string;
  snipUser: string;
};

const CustomForm = (props: formPropsT) => {
  const { notify } = useOutletContext();
  const [animationState, setFormState] = React.useState({ showForm: true });
  React.useEffect(() => {
    // unmount form
    if (!animationState.showForm) {
      // console.log('unmounting the form')
      // setState in handleClose() is async so I need to make this wait for the animation to finish
      setTimeout(() => {
        props.hidePopUp();
      }, 300);
    }
  }, [animationState.showForm]);

  // unmount on Esc
  React.useEffect(() => {
    const eventCB = (e) => {
      if (e.which == 27) {
        setFormState((state) => {
          const stateClone = structuredClone(state);
          stateClone.showForm = false;
          return stateClone;
        });
      }
    };
    window.document.body.addEventListener('keydown', eventCB);

    return () => {
      removeEventListener('keydown', eventCB);
    };
  }, []);

  const refs = {
    title: useRef<HTMLInputElement>(null),
    descr: useRef<HTMLInputElement>(null),
    snippet: useRef<{ parent: HTMLElement | null; snippet: any | null }>({
      parent: null,
      snippet: null,
    }),
    formButton: useRef<HTMLButtonElement>(null),
    isPrivate: useRef<HTMLInputElement>(null),
    categories: useRef<HTMLSelectElement>(null),
    language: useRef<HTMLSelectElement>(null),
    error: useRef<Boolean>(true), // the form is invalid by default
  };

  // // input validation
  // const validateForm = () => {
  //   //helpers
  //   const removeInvalidStyle = (el: HTMLElement | HTMLInputElement | null) => {
  //     //removes error styling if exists
  //     const invalidInputStyle = `border-2 border-red-400 before:block`;
  //     invalidInputStyle.split(' ').forEach((styleClass) => {
  //       el?.classList.remove(styleClass);
  //     });
  //     el?.parentNode?.querySelector('.error')?.classList.add('hidden');
  //     // console.log('removing red border');
  //   };
  //   const addInvalidStyle = (
  //     el: HTMLElement | HTMLInputElement | null,
  //     msg: string,
  //   ) => {
  //     el?.classList.remove('border-2');
  //     el?.classList.remove('border-green-400');

  //     const invalidInputStyle = `border-2 border-red-400`;
  //     invalidInputStyle.split(' ').forEach((styleClass) => {
  //       el?.classList.add(styleClass);
  //     });

  //     el?.parentNode
  //       ?.querySelector('.error')
  //       ?.replaceChildren(document.createTextNode(msg));
  //     el?.parentNode?.querySelector('.error')?.classList.remove('hidden');
  //     // console.log('adding red border');
  //   };
  //   const addValidStyle = (el: HTMLElement | null) => {
  //     //removes error styling if exists
  //     el?.classList.add('border-2');
  //     el?.classList.add('border-green-400');
  //     // console.log('adding green border');
  //   };
  //   //validators
  //   const validateTitle = () => {
  //     const element = refs.title.current;
  //     removeInvalidStyle(element);
  //     if (
  //       element?.value &&
  //       element.value.length < 100 &&
  //       element.value.length > 0
  //     ) {
  //       addValidStyle(element);
  //       return true;
  //     }
  //     addInvalidStyle(element, 'the input is out of range (0-100)');
  //     return false;
  //   };
  //   const validateDescription = () => {
  //     const element = refs.descr.current;
  //     removeInvalidStyle(element);
  //     if (
  //       element?.value &&
  //       element.value.length < 1000 &&
  //       element.value.length > 0
  //     ) {
  //       addValidStyle(element);
  //       return true;
  //     }
  //     return addInvalidStyle(element, 'the input is out of range (0-1000)');
  //   };
  //   const validateSnippet = () => {
  //     // console.log('snippet validation--------------------- ');
  //     const elementParent = refs.snippet.current.parent;
  //     const element = refs.snippet.current.snippet;
  //     removeInvalidStyle(elementParent);
  //     if (element.getValue().length < 1000 && element.getValue().length > 0) {
  //       addValidStyle(elementParent);
  //       return true;
  //     }
  //     addInvalidStyle(elementParent, 'the input is out of range (0-1000)');
  //     return false;
  //   };
  //   const validateCategories = () => {
  //     const categoriesInput = refs.categories.current;
  //     const parent = categoriesInput.parentNode;
  //     removeInvalidStyle(parent);
  //     if (!categoriesInput.value) {
  //       console.log('value id empty');
  //       addInvalidStyle(
  //         parent,
  //         'make sure you chose categories (space separated)',
  //       );
  //       return false;
  //     }
  //     return true;
  //   };
  //   const validateLanguage = () => {
  //     const languageInput = refs.language.current;
  //     const parent = languageInput.parentNode;
  //     removeInvalidStyle(parent);
  //     if (!languageInput.value) {
  //       addInvalidStyle(parent, 'make sure you chose a language');
  //       return false;
  //     }
  //     return true;
  //   };
  //   // listeners
  //   refs.title.current?.addEventListener('blur', validateTitle);
  //   refs.descr.current?.addEventListener('blur', validateDescription);
  //   refs.categories.current?.addEventListener('blur', validateCategories);
  //   refs.language.current?.addEventListener('blur', validateLanguage);

  //   // checks after submit button is clicked
  //   refs.formButton.current?.addEventListener('click', () => {
  //     if (
  //       validateTitle() &&
  //       validateDescription() &&
  //       validateSnippet() &&
  //       validateCategories() &&
  //       validateLanguage()
  //     ) {
  //       refs.error.current = false; // this ref is checked before submission
  //     }
  //   });
  // };

  // useEffect(validateForm, []);

  const handleClose = (/* e?: React.MouseEventHandler<HTMLDivElement> */) => {
    // if (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    // unmount the sub-form so that framer motion can animate it before removing it from the DOM.
    // console.log('animating away')
    setFormState((state) => {
      const stateClone = structuredClone(state);
      stateClone.showForm = false;
      return stateClone;
    });
  };

  // type filedsKeysT =
  //   | 'title'
  //   | 'descr'
  //   | 'snippet'
  //   | 'categories'
  //   | 'isPrivate'
  //   | 'language';
  // type fieldPropsT = Partial<Record<filedsKeysT, string | boolean>>;
  // const createRequestBody = () => {
  //   const body: { props: fieldPropsT } = { props: {} };

  //   // console.log(props.fields);
  //   props.fields.forEach((field) => {
  //     const fieldKey = field.attr.key;
  //     // keept the != undefined, because js is weird
  //     if (refs?.[fieldKey] != undefined) {
  //       if (fieldKey == 'isPrivate') {
  //         // console.log('fieldtype', refs[fieldKey].current.checked);
  //         body.props[fieldKey] = refs[fieldKey].current?.checked;
  //       } else if (fieldKey == 'snippet') {
  //         const snippetValue = refs[fieldKey].current?.snippet.getValue();
  //         body.props[fieldKey] = snippetValue;
  //         // console.log(body.props[fieldKey]);
  //       } else {
  //         // console.log(refs[fieldKey].current);
  //         body.props[fieldKey] = refs[fieldKey].current?.value;
  //       }
  //     }
  //   });

  //   // console.log(body);
  //   return body;
  // };

  const handleEdit = async (values: {}) => {
    const requestBody = { props: values };
    // console.log('handle create', {requestBody, values});

    const response = await update(props.snipUser + '/' + props.snipId, {
      user: props.snipUser,
      ...requestBody,
    });
    notify({ type: 'info', msg: response.msg });

    props.updateEditedSnippet();
  };

  const handleCreate = async (values: {}) => {
    const requestBody = { props: values };
    // console.log('handle create', {requestBody, values});

    // console.log(props.owner);
    const response = await create(`${props.owner}/snippet`, requestBody);
    notify({ type: 'info', msg: response.msg });
    props.refetch();
  };

  const handleSubmit = async (values) => {
    handleClose(); // set state for unmounting the form

    if (props.action == 'edit') {
      return handleEdit(values);
    }

    await handleCreate(values);

    handleClose(); //- hacky solution for refetching updated snippets after form action
  };

  // console.log(Object.values(props.fields)[2].attr);
  // listing form fields
  const listInputs = (touched, errors, setFieldValue, setFieldTouched) => {
    // console.log({ errors, touched });
    // console.log(fields);
    return props.fields.map((input) => {
      const Component = getFieldsMap(input.type);
      let inputType: 'normal' | 'custom' =
        typeof Component == 'object' || typeof Component == 'function'
          ? 'custom'
          : 'normal';

      // console.log('field', input.attr.name, inputType, typeof Component);

      const addedConditionalAttributes = {};
      if (inputType == 'custom') {
        addedConditionalAttributes.setFieldValue = setFieldValue;
      }

      if (input.attr.key == 'descr') {
        let descrHeight = 2 * 35;
        if (input.attr?.defaultValue) {
          descrHeight = (input.attr.defaultValue.length / 51) * 35;
        }

        return (
          <label
            key={input.attr.key}
            className={
              input.attr.className ??
              '' +
                'z-30 relative' +
                (touched[input.attr.name] && errors[input.attr.name]
                  ? ' invalid'
                  : ' valid')
            }
          >
            <Field
              name={input.attr.name}
              type='textarea'
              style={{
                height: `min(${descrHeight}px, 100px)`,
                width: '100%',
              }}
            />
            <div
              className={`text-error ${
                touched[input.attr.name] && errors[input.attr.name]
                  ? 'opacity-1'
                  : 'opacity-0'
              } p-1 transition-opacity duration-200 ease-in-out`}
            >
              {(touched[input.attr.name] && errors[input.attr.name]) ??
                'placeholder'}
            </div>
          </label>
        );
      }

      return (
        <label
          key={input.attr.name}
          className={
            input.attr.className ??
            '' +
              ' z-30 relative' +
              (input.attr.name == 'isPrivate'
                ? ' self-start flex flex-row gap-3 items-center'
                : '') +
              (touched[input.attr.name] && errors[input.attr.name]
                ? ' invalid'
                : '')
          }
        >
          {inputType == 'custom' ? (
            <Field name={input.attr.name} type={input.attr.type}>
              {({ field: { value }, form: { setFieldValue } }) => {
                const conditionalProps = {};
                if (typeof Component == 'object') {
                  conditionalProps.ref = refs[input?.attr?.key];
                }
                return (
                  <Component
                    {...conditionalProps}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    attr={{
                      ...input.attr,
                      value,
                      style: { width: '100%' },
                    }}
                    key={input.attr.key}
                  />
                );
              }}
            </Field>
          ) : (
            <Field name={input.attr.name} type={input.attr.type} />
          )}
          <div
            className={`text-error ${
              touched[input.attr.name] && errors[input.attr.name]
                ? 'opacity-1'
                : 'opacity-0'
            } p-1 transition-opacity duration-200 ease-in-out`}
          >
            {(touched[input.attr.name] && errors[input.attr.name]) ||
              'placeholder'}
          </div>
        </label>
      );
    });
  };

  return (
    <AnimatePresence>
      {animationState.showForm ? (
        <motion.div
          key={'silly yet important property'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`backdrop-blur-sm z-10 fixed top-0 left-0
                        w-full h-full flex items-center justify-center`}
        >
          <div
            onClick={handleClose}
            className={`fixed content-[""] top-0 left-0
                        w-full h-full`}
          ></div>
          <motion.div
            key={'silly yet important property'}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
            className=' p-6 pt-8
                      bg-bg z-30 drop-shadow-2xl relative
                      w-[600px] sm>:w-full'
          >
            <Formik
              // enableReinitialize={true}
              onSubmit={(values, actions) => {
                // console.log({ values, actions })
                setTimeout(() => {
                  handleSubmit(values);
                  // toast.success('Resume was edited successfully');
                  actions.setSubmitting(false);
                  // actions.resetForm();
                }, 1000);
              }}
              initialValues={props.fields.reduce((acc, field) => {
                if (field.attr.placeHolder) {
                  acc[field.attr.key] = field.attr.placeHolder;
                } else if (field.attr.defaultValue) {
                  acc[field.attr.key] = field.attr.defaultValue;
                } else {
                  acc[field.attr.key] = '';
                }

                return acc;
              }, {})}
              validationSchema={props.validationSchema}
            >
              {({
                touched,
                errors,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
              }) => (
                <Form className='flex flex-col gap-2 '>
                  <div
                    aria-label='close form'
                    onClick={handleClose}
                    className='absolute content-["X"] top-2 right-2
                            text-xl cursor-pointer
                            hover:text-primary
                            transition-color duration-200'
                  >
                    X
                  </div>
                  {listInputs(touched, errors, setFieldValue, setFieldTouched)}
                  <button
                    disabled={isSubmitting}
                    type='submit'
                    ref={refs.formButton}
                    className={`w-[100px] bg-lime-700 leading-8
                               rounded-md  text-gray-300
                               mx-auto z-10
                               disabled:bg-slate-500`}
                  >
                    {props.action == 'edit' ? 'Edit' : 'Create'}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
};
export default CustomForm;
