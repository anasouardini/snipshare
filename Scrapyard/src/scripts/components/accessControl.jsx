import React, {useState, forwardRef, useEffect} from 'react';

const AccessControl = (props, ref) => {
    const [accessState, setAccessState] = useState({});
    const markChangedCoworker = props?.markChangedCoworker ?? (() => {});

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
        parent: 'flex gap-2 flex-wrap',
        checkbox: 'ml-1',
        checkboxLabel: 'ml-3',
    };
    const styles = {
        tag: {
            cursor: 'pointer',
            display: 'inline-block',
            width: 'max-content',
            padding: '4px 10px 3px',
            marginLeft: '5px',
            borderRadius: '10px',
            fontSize: '.8rem',
            fontWeight: 'bolder',
            letterSpacing: '1px',
            background: 'rgb(101 163 13 / .25)',
            border: '1px solid rgb(101 163 13)',
            checkbox: {display: 'none'},
        },
    };

    const onLabelClick = (e) => {
        const checked = Number(e.currentTarget.children[0].checked);
        e.currentTarget.children[0].checked = !e.currentTarget.children[0].checked;
        // toggle checked effect
        e.currentTarget.classList.replace(
            `grayscale-[${Number(!checked)}]`,
            `grayscale-[${checked}]`
        );

        markChangedCoworker();
    };
    const handleKeyPress = (e) => {
        if (e.code == 'Space' || e.code == 'Enter') {
            onLabelClick(e);
        }
    };

    // each checkbox creates an access on the ref
    return (
        <div className={classes.parent}>
            {Object.keys(accessState).length ? (
                <>
                    {props.type == 'generic' ? (
                        <label
                            role='button'
                            aria-disabled='false'
                            onKeyPress={handleKeyPress}
                            onClick={onLabelClick}
                            tabIndex={0}
                            style={styles.tag}
                            className={`${classes.checkboxLabel} grayscale-[${Number(
                                !accessState.create
                            )}]`}
                        >
                            Create
                            <input
                                style={styles.tag.checkbox}
                                className={classes.checkbox}
                                type='checkbox'
                                ref={(el) => {
                                    ref.create = el;
                                }}
                                name='create'
                                defaultChecked={accessState.create}
                            />
                        </label>
                    ) : (
                        <></>
                    )}
                    <label
                        role='button'
                        aria-disabled='false'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        tabIndex={0}
                        style={styles.tag}
                        className={`${classes.checkboxLabel} grayscale-[${Number(
                            !accessState.read
                        )}]`}
                    >
                        Read
                        <input
                            style={styles.tag.checkbox}
                            className={classes.checkbox}
                            type='checkbox'
                            ref={(el) => {
                                ref.read = el;
                            }}
                            name='read'
                            defaultChecked={accessState.read}
                        />
                    </label>
                    <label
                        role='button'
                        aria-disabled='false'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        tabIndex={0}
                        style={styles.tag}
                        className={`${classes.checkboxLabel} grayscale-[${Number(
                            !accessState.update
                        )}]`}
                    >
                        Update
                        <input
                            style={styles.tag.checkbox}
                            className={classes.checkbox}
                            type='checkbox'
                            ref={(el) => {
                                ref.update = el;
                            }}
                            name='update'
                            defaultChecked={accessState.update}
                        />
                    </label>
                    <label
                        role='button'
                        aria-disabled='false'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        tabIndex={0}
                        style={styles.tag}
                        className={`${classes.checkboxLabel} grayscale-[${Number(
                            !accessState.delete
                        )}]`}
                    >
                        Delete
                        <input
                            style={styles.tag.checkbox}
                            className={classes.checkbox}
                            type='checkbox'
                            ref={(el) => {
                                ref.delete = el;
                            }}
                            name='delete'
                            defaultChecked={accessState.delete}
                        />
                    </label>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default forwardRef(AccessControl);
