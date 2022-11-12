import React from 'react';

const eventSource = new EventSource('http://127.0.0.1:2000/event');

eventSource.addEventListener(
    'message',
    function (e) {
        var data = JSON.parse(e.data);
        console.log(data.id, data.msg);
    },
    false
);
eventSource.onmessage = (e) => {
    console.log('data: ', e.data);
};
eventSource.onerror = (err) => {
    console.log('errrrrrrrrr: ', err);
};

export default function SSE() {
    return <></>;
}
