import {forwardRef} from 'react';

const AccessControl = forwardRef((props, ref) => {
    return (
        <div>
            <input
                className="accent-lime-600"
                type="checkbox"
                ref={(el) => {
                    ref.read = el;
                }}
                name="read"
                defaultChecked={props?.coworkerAccess?.read ?? false}
                onChange={() => {}}
            />
            <input
                className="accent-lime-600"
                type="checkbox"
                ref={(el) => {
                    ref.update = el;
                }}
                name="update"
                defaultChecked={props?.coworkerAccess?.update ?? false}
                onChange={() => {}}
            />
            <input
                className="accent-lime-600"
                type="checkbox"
                ref={(el) => {
                    ref.delete = el;
                }}
                name="delete"
                defaultChecked={props?.coworkerAccess?.delete ?? false}
                onChange={() => {}}
            />
        </div>
    );
});

export default AccessControl;
