import React from 'react';

export default function Snippet(props) {
    // console.log('hell');

    const lorem =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley";

    return (
        <>
            <style>{`.private:{}`}</style>
            <div
                draggable="false"
                className={`shadow-lg shadow-lime-100 ${
                    props.snippet?.descr
                        ? ''
                        : 'pointer-events-none select-none relative after:absolute after:content-["PRIVATE"] after:top-[40%] after:left-[34%] after:font-extrabold after:text-red-600 after:text-2xl after:border-y-[5px] after:border-red-600'
                }`}
            >
                <div
                    className={`snippet flex flex-col max-w-[380px] p-8  ${
                        props.snippet?.descr ? '' : 'blur-[2px]'
                    }`}
                >
                    <h3 className="text-xl text-gray-700 mb-3">{props.snippet.title}</h3>
                    <p className="text-[1.1rem] text-gray-500">
                        {props.snippet?.descr ? props.snippet.descr : lorem}
                    </p>
                    <hr className="border-none h-[1px] bg-gray-400 my-5 mx-auto w-[100px]" />
                    <div className=" text-gray-700">
                        <p>
                            status:&nbsp;
                            <span className="text-gray-500">
                                {props.snippet.isPrivate ? 'private' : 'public'}
                            </span>
                        </p>
                        <p>
                            allowed actions:&nbsp;
                            <span className="text-gray-500">
                                {props.snippet.allowedActions.reduce(
                                    (acc, action) => acc + ' | ' + action
                                )}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
