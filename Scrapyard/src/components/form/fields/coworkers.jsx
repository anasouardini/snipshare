import React from 'react';
import {Bridge} from '../../../tools/stateBridge';

export default function Coworkers(props) {
    const [coworkerState, setCoworkerState] = useState(Bridge.getState('form', 'coworkerState'));
    const [usresState, setUsersState] = useState([]);

    const refs = {
        coworker: useRef('noUser'),
        actions: {read: useRef(true), edit: useRef(true), delete: useRef(true)},
    };

    const handleAddCoworker = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const coworkerActions = [];
        Object.keys(refs.actions).forEach((objKey) => {
            if (refs.actions[objKey].current.checked) {
                coworkerActions.push(objKey);
            }
        });
        const coworker = {user: refs.coworker.current.value, actions: coworkerActions};

        // add new coworkers to form state
        const stateClone = deepClone(coworkerState);
        stateClone.coworkers[refs.coworker.current.value] = coworker;
        setCoworkerState(stateClone);
    };

    const loadUsers = () => {
        return usresState.map((usr) => (
            <option key={usr} name={usr}>
                {usr}
            </option>
        ));
    };

    useEffect(() => {
        (async () => {
            const response = await read(`users`);

            if (response) {
                // console.log('fetching');
                console.log(response);
                if (response.status == 200) {
                    setUsersState(response.msg);
                }
            }
        })();
    }, []);

    return (
        <>
            <h2>add co-workers</h2>

            <div className="">
                <select
                    className="inline border-2 border-lime-300 bg-[#181818]"
                    ref={refs.coworker}
                    name="coworkers"
                >
                    {loadUsers()}
                </select>
                <div className="inline">
                    <label className="ml-3">
                        <input
                            className="mr-1"
                            ref={refs.actions.read}
                            type="checkbox"
                            name="read"
                        />
                        read
                    </label>
                    <label className="ml-3">
                        <input
                            className="mr-1"
                            ref={refs.actions.edit}
                            type="checkbox"
                            name="edit"
                        />
                        edit
                    </label>
                    <label className="ml-3">
                        <input
                            className="mr-1"
                            ref={refs.actions.delete}
                            type="checkbox"
                            name="delete"
                        />
                        delete
                    </label>
                </div>
                <button
                    className="ml-2 px-2 float-right border-b-2 border-b-lime-300 p-1"
                    onClick={handleAddCoworker}
                >
                    Add
                </button>
                <br />
                <br />

                {Object.keys(coworkerState.coworkers).length ? (
                    <ul>
                        {Object.keys(coworkerState.coworkers).map((coworker) => {
                            return (
                                <li>
                                    <span>{coworker}: &nbsp;</span>
                                    {coworkerState.coworkers[coworker].actions.map((act) => (
                                        <span className="text-gray-600">{act} &nbsp;</span>
                                    ))}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
