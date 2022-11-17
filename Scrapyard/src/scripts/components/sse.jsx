import React, {useEffect} from 'react';

export default function SSE(props) {
    useEffect(() => {
        const eventSource = new EventSource('http://127.0.0.1:2000/listenEvent', {
            withCredentials: true,
        });
        const messageHandler = (e) => {
            console.log(e.data);
            // todo:
            // make the <Bell/> refetch the notifications
            props.notify({type: 'info', msg: e.data});
        };
        const errorHandler = (err) => {
            console.error('error: ', err);
        };
        const messageListener = eventSource.addEventListener('message', messageHandler);
        const errorListener = eventSource.addEventListener('error', errorHandler);
        return () => {
            eventSource.removeEventListener(messageListener, messageHandler);
            eventSource.removeEventListener(errorListener, errorHandler);
        };
    }, []);
    return <></>;
}
