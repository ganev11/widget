import { useEffect, useRef } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { widgetStatus } from "../Widget";
import { messagesStore } from '../messagesStore';

export function Close({ onToggle }) {
    const status = useStore(widgetStatus);

    return (
        <>
            {(status === 'closing') && (
                <div class="hw-messages">
                    <button class="send-btn prompt-btn" onClick={e => {
                        e.stopPropagation();
                        messagesStore.set([]);
                        widgetStatus.set('refresh');
                    }}>
                        <span class="icon"></span>
                        <span class="label">Clear History</span>
                    </button>
                    <button class="send-btn prompt-btn" onClick={e => {
                        e.stopPropagation();
                        onToggle();
                        widgetStatus.set('idle');
                    }}>
                        <span class="icon"></span>
                        <span class="label">Minimize</span>
                    </button>
                    <button class="send-btn prompt-btn" onClick={e => {
                        e.stopPropagation();
                        widgetStatus.set('idle');
                    }}>
                        <span class="icon"></span>
                        <span class="label">Cancel</span>
                    </button>
                </div>
            )}
        </>
    );
}

