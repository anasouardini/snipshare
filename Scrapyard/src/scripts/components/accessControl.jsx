import React, {useState, forwardRef, useEffect} from 'react';

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
            setAccessState({read: false, update: false, delete: false});
        }
    }, []);

    const classes = {
        parent: 'flex flex-gap-2',
        checkbox: 'ml-1',
        checkboxLabel: 'ml-3',
    };

    // each checkbox creates an access on the ref
    return (
        <div className={classes.parent}>
            {Object.keys(accessState).length ? (
                <>
                    {props.type == 'generic' ? (
                        <label className={classes.checkboxLabel}>
                            Create
                            <input
                                onChange={props.markChangedCoworker}
                                className={classes.checkbox}
                                type="checkbox"
                                ref={(el) => {
                                    ref.create = el;
                                }}
                                name="create"
                                defaultChecked={accessState.create}
                                // onChange={() => {}}
                            />
                        </label>
                    ) : (
                        <></>
                    )}
                    <label className={classes.checkboxLabel}>
                        Read
                        <input
                            onChange={props.markChangedCoworker}
                            className={classes.checkbox}
                            type="checkbox"
                            ref={(el) => {
                                ref.read = el;
                            }}
                            name="read"
                            defaultChecked={accessState.read}
                            // onChange={() => {}}
                        />
                    </label>
                    <label className={classes.checkboxLabel}>
                        Update
                        <input
                            onChange={props.markChangedCoworker}
                            className={classes.checkbox}
                            type="checkbox"
                            ref={(el) => {
                                ref.update = el;
                            }}
                            name="update"
                            defaultChecked={accessState.update}
                            // onChange={() => {}}
                        />
                    </label>
                    <label className={classes.checkboxLabel}>
                        Delete
                        <input
                            onChange={props.markChangedCoworker}
                            className={classes.checkbox}
                            type="checkbox"
                            ref={(el) => {
                                ref.delete = el;
                            }}
                            name="delete"
                            defaultChecked={accessState.delete}
                            // onChange={() => {}}
                        />
                    </label>
                </>
            ) : (
                <></>
            )}
        </div>
    );
});

export default AccessControl;
