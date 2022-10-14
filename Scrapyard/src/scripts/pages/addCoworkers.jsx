import React from 'react';
import {useContext} from 'react';
import {useRef} from 'react';
import {forwardRef} from 'react';
import {coworkersContext} from './shared/sharedLayout';

const accessControl = forwardRef((props, ref) => {
    return (
        <div>
            <input
                type="checkbox"
                ref={(el) => {
                    ref.read = el;
                }}
                name="read"
                checked={props?.coworkerAccess?.read ?? false}
            />
            <input
                type="checkbox"
                ref={(el) => {
                    ref.update = el;
                }}
                name="update"
                checked={props?.coworkerAccess?.update ?? false}
            />
            <input
                type="checkbox"
                ref={(el) => {
                    ref.delete = el;
                }}
                name="delete"
                checked={props?.coworkerAccess?.delete ?? false}
            />
        </div>
    );
});

export default function AddRules() {
    const coworkers = useContext(coworkersContext);

    // list of checkboxes
    const genericAaccessRefs = useRef({
        new: {read: '', update: '', delete: ''},
        old: {},
    });

    const exceptionAaccessRefs = useRef({
        new: {},
        old: {},
    });

    const getCoworkerAccess = (username) => {
        const access = {};

        // this spagetty needs some clean up
        const userExceptions = genericAaccessRefs.old[username];
        access.exception = Object.keys(userExceptions).reduce((acc, excObjKey) => {
            acc[excObjKey] = Object.keys(userExceptions[excObjKey]).reduce((acc, accessObjKey) => {
                acc += userExceptions[excObjKey][accessObjKey] ? accessObjKey.split[0] : '';
                return acc;
            }, '');
            return acc;
        }, {});

        access.generic = Object.keys(exceptionAaccessRefs.old[username]).reduce((acc, objKey) => {
            acc += genericAaccessRefs.old[username][objKey] ? objKey.split[0] : '';
            return acc;
        }, '');

        return access;
    };

    const listCoworkers = () =>
        coworkers.map((coworker) => {
            genericAaccessRefs.old[coworker.username] = {read: '', update: '', delete: ''};
            return (
                <li>
                    <div>
                        <div>
                            <img src="" alt="" />
                            <span>{coworker.username}</span>
                        </div>
                        <accessControl ref={genericAaccessRefs[coworker.username]} />

                        <button>Update</button>
                        <button>delete</button>
                        <button>exceptions</button>
                    </div>
                </li>
            );
        });

    return (
        <div>
            <div>
                <input type="text" placeholder="user" />
                <accessControl ref={genericAaccessRefs.new} />
                <button>exceptions</button>
                <button className="border-1-lime border-radius-[50%] text-xl">+</button>
            </div>
            <div>
                <ul>{listCoworkers()}</ul>
            </div>
        </div>
    );
}
