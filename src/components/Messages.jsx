import { useEffect, useRef } from "preact/hooks";
import { marked } from 'marked';
import { Reasons } from "./Reasons";
import { Actions } from "./Actions";

export function Messages({ messages, send }) {
    const wrapperRef = useRef();

    useEffect(() => {
        const el = wrapperRef.current;
        // jump straight to the bottom of the wrapper
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);  // run whenever messages array changes
      
    return (
        <>
            <div class="hw-messages-wrapper" ref={wrapperRef}>
                <div class="hw-messages">
                    {messages.map((message, i) => (
                        <Message key={i} message={message} />
                    ))}
                    <Reasons containerRef={wrapperRef} />
                    <Actions messages={messages} send={send} />
                </div>
            </div>
        </>
    );
}

function Message({ message }) {
    const ref = useRef();

    useEffect(() => {
        if (message.isStreaming && ref.current) {
            // Only update the innerHTML of this one bubble:
            ref.current.innerHTML = marked.parse(message.content);
        }
    }, [message.content, message.isStreaming]);

    return (
        message.content && 
        <div class={`hw-msg ${message.role}`} ref={ref}>
            { !message.isStreaming && <div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} /> }
        </div>
    );
}