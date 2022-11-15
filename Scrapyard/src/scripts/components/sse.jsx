import React, {useEffect} from 'react';

export default function SSE(props) {
    useEffect(() => {
        const eventSource = new EventSource('http://127.0.0.1:2000/listenEvent', {withCredentials: true});

        const messageListener = eventSource.addEventListener('message', (e) => {
            console.log(e.data);
            // todo:
            // make the <Bell/> refetch the notifications
           props.notify({type: 'info', msg: e.data});
        });
        const errorListener = eventSource.addEventListener('error', (err) => {
            console.error('error: ', err);
        });
        return () => {
            eventSource.removeEventListener(messageListener);
            eventSource.removeEventListener(errorListener);
        };
    }, []);
    return <></>;
}
