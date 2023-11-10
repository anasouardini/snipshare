import React, {useState, forwardRef, useEffect} from 'react';

const AccessControl = (props, ref) => {
    const [accessState, setAccessState] = useState({});
    const markChangedCoworker = props?.markChangedCoworker ?? (() => {});

    useEffect(() => {
        if (props?.coworkerAccess) {
            const accessObj = Object.keys(props?.coworkerAccess).reduce(
                (acc, accessKey) => {
                    acc[accessKey] = props?.coworkerAccess[accessKey];
                    return acc;
                },
                {}
            );
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
            padding: '2px 10px',
            marginLeft: '5px',
            borderRadius: '10px',
            fontSize: '.8rem',
            letterSpacing: '1px',
            background: 'rgb(101 163 13 / .25)',
            border: '1px solid rgb(101 163 13)',
            checkbox: {display: 'none'},
        },
    };

    const onLabelClick = (e) => {
        const checked = Number(e.currentTarget.children[0].checked);
        // console.log(checked);
        e.currentTarget.children[0].checked = !e.currentTarget.children[0].checked;
        // toggle checked effect
        e.currentTarget.style.filter = `grayscale(${checked})`;

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
                            role='checkbox'
                            tabIndex='0'
                            aria-label='create access'
                            onKeyPress={handleKeyPress}
                            onClick={onLabelClick}
                            style={{
                                ...styles.tag,
                                filter: `grayscale(${Number(!accessState.create)})`,
                            }}
                            className={classes.checkboxLabel}
                        >
                            Create
                            <input
                                aria-hidden='true'
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
                        role='checkbox'
                        tabIndex='0'
                        aria-label='read access'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        style={{
                            ...styles.tag,
                            filter: `grayscale(${Number(!accessState.read)})`,
                        }}
                        className={classes.checkboxLabel}
                    >
                        Read
                        <input
                            aria-hidden='true'
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
                        role='checkbox'
                        tabIndex='0'
                        aria-label='update access'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        style={{
                            ...styles.tag,
                            filter: `grayscale(${Number(!accessState.update)})`,
                        }}
                        className={classes.checkboxLabel}
                    >
                        Update
                        <input
                            aria-hidden='true'
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
                        role='checkbox'
                        tabIndex='0'
                        aria-label='delete access'
                        onKeyPress={handleKeyPress}
                        onClick={onLabelClick}
                        style={{
                            ...styles.tag,
                            filter: `grayscale(${Number(!accessState.delete)})`,
                        }}
                        className={classes.checkboxLabel}
                    >
                        Delete
                        <input
                            aria-hidden='true'
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
