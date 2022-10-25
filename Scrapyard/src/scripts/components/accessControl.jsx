import {useEffect} from 'react';
import {useState} from 'react';

import {forwardRef} from 'react';

const AccessControl = forwardRef((props, ref) => {
    const [accessState, setAccessState] = useState({});

    useEffect(() => {
        if (props?.coworkerAccess) {
            const accessObj = Object.keys(props?.coworkerAccess).reduce((acc, accessKey) => {
                acc[accessKey] = props?.coworkerAccess[accessKey];
                return acc;
            }, {});
            // console.log(accessObj);
            setAccessState(accessObj);
        } else {
            setAccessState({read: false, read: false, update: false, delete: false});
        }
    }, []);

    // each checkbox creates an access on the ref
    return (
        <div>
            {Object.keys(accessState).length ? (
                <>
                    {props.type == 'generic' ? (
                        <input
                            className="accent-lime-600"
                            type="checkbox"
                            ref={(el) => {
                                ref.create = el;
                            }}
                            name="create"
                            defaultChecked={accessState.create}
                            // onChange={() => {}}
                        />
                    ) : (
                        <></>
                    )}
                    <input
                        className="accent-lime-600"
                        type="checkbox"
                        ref={(el) => {
                            ref.read = el;
                        }}
                        name="read"
                        defaultChecked={accessState.read}
                        // onChange={() => {}}
                    />
                    <input
                        className="accent-lime-600"
                        type="checkbox"
                        ref={(el) => {
                            ref.update = el;
                        }}
                        name="update"
                        defaultChecked={accessState.update}
                        // onChange={() => {}}
                    />
                    <input
                        className="accent-lime-600"
                        type="checkbox"
                        ref={(el) => {
                            ref.delete = el;
                        }}
                        name="delete"
                        defaultChecked={accessState.delete}
                        // onChange={() => {}}
                    />
                </>
            ) : (
                <></>
            )}
        </div>
    );
});

export default AccessControl;
