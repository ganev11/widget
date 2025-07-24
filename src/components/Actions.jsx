import { useEffect, useRef } from "preact/hooks";
import { widgetStatus } from "../Widget";
import { useStore } from "@nanostores/preact";

export function Actions({ messages, send }) {
    const message = messages[messages.length - 1] || null;

    const actions = message?.actions || [];

	return (
		<>
		{(actions.length > 0 &&
			<div class="hw-msg actions">
				{actions.map((action, i) => (
					<Action key={i} action={action} send={send} />
				))}
			</div>
		)}
		</>
	);
}

function Action({ action, send }) {
    if (action.type === 'question') {
        return (
            <button class="send-btn prompt-btn" onClick={e => {
                e.stopPropagation();
                if (send) send(action.text);
            }}>
                <span class="icon"></span>
                <span class="label">{action.text}</span>
            </button>
        );
    }
    if (action.type === 'selection') {
        const odd = (action.data.odds[0]) ? action.data.odds[0].value : '';

        return (
            <button class="send-btn selection-btn" onClick={e => {
                e.stopPropagation();
                addToBetSlip(action.data.odds);
                alert(JSON.stringify(action.data.odds, null, 2));
            }}>
                <span class="icon"></span>
                <span class="label">{action.data.selection_text} ({odd})</span>
            </button>
        );
    }
    return null;
}

function addToBetSlip(odds) {
    if (!odds || odds.length === 0) {
        console.warn('No odds to add to bet slip');
        return;
    }
    if (window.altenarWSDK) {
        try {
            const oddIds = odds.map(bet => bet.selection_id).filter(Boolean);
            if (oddIds.length === 0) {
                console.warn('No valid selection_id in odds');
                return;
            }
            window.altenarWSDK.set({ oddIds: oddIds.join(',') });
        } catch (err) {
            console.error('Failed to add bets to altenarWSDK:', err);
        }
    } else {
        console.warn('altenarWSDK widget is not loaded');
    }
}