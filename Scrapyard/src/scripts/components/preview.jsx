import React from 'react';
import fieldsMap from './form/fieldsMap';

export default function Preview(props) {
    return (
        <div className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center`}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    props.hidePopUp('preview');
                }}
                className={`fixed content-[""] top-0 left-0
                        w-full h-full bg-lime-600 opacity-20`}
            ></div>
            <div className="flex flex-col w-[600px] gap-6 p-6 pt-8 bg-[#181818] z-30 drop-shadow-2xl relative">
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        props.hidePopUp('preview');
                    }}
                    className='absolute content-["X"] top-2 right-2 text-xl cursor-pointer'
                >
                    X
                </span>
                <h2 className="text-2xl font-bold">{props.data.title}</h2>
                <p className="">{props.data.descr}</p>
                {props.data?.snippet ? (
                    <pre className="bg-cyan-900 text-white p-2">
                        <code className="">{props.data.snippet}</code>
                    </pre>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
