import { h } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { Header } from './components/Header';
import { Input } from './components/Input';
import { Messages } from './components/Messages';
import { Close } from './components/Close';
import { messageReducer, toMessagesArray, getFirstResponseId } from './utils';
import './widget.css';
import { messagesStore as defaultMessageStore } from './messagesStore';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/preact';
import { WidgetButton } from './components/WidgetButton';
import { Footer } from './components/Footer';
import { getDefaultAssistantMessage } from './defaultAssistantMessage.js';

export const widgetStatus = atom('idle');
export const widgetReasons = atom([]);

export default function Widget(config) {
	const messagesStore = config.messageStore || defaultMessageStore;
	const [open, setOpen] = useState(!config.minimized);
	const [messages, setMessages] = useState(() => {
		const initial = messagesStore.get();
		if (!initial || initial.length === 0) {
			const msg = getDefaultAssistantMessage(config);
			messagesStore.set([msg]);
			return [msg];
		}
		return initial;
	});
	const [draft, setDraft] = useState('');
	const [actions, setActions] = useState([]);
	const actionsRef = useRef([]);
	const status = useStore(widgetStatus);

	// Keep an AbortController around to cancel the SSE stream
	const abortCtrl = useRef(null);

	useEffect(() => {
		if (status === 'refresh') {
			const current = messagesStore.get();
			if (!current || current.length === 0) {
				const msg = getDefaultAssistantMessage(config);
				setMessages([msg]);
				messagesStore.set([msg]);
			} else {
				setMessages([...current]);
			}
			widgetStatus.set('idle');
		}
		if (status === 'idle') {
			widgetReasons.set([]);
		}
	}, [status]);

	async function ask(question, onToken, onDone) {
		// Abort any prior request
		if (abortCtrl.current) abortCtrl.current.abort();
		abortCtrl.current = new AbortController();
		try {
			const body = {
				model: config.model,
				messages: [...toMessagesArray(messages), question],
				previous_response_id: getFirstResponseId(messages),
				stream: true,
			};
			if (config.metadata != null) {
				body.metadata = config.metadata;
			}

			// Build URL
			let url = `${config.baseURL}/api/v1/chat/completions`;

			// Build fetch options
			const fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.api_key}`,
				},
				body: JSON.stringify(body),
				signal: abortCtrl.current.signal,
			};
			if (config.cookieAuth) {
				fetchOptions.credentials = 'include';
			}

			const res = await fetch(url, fetchOptions);
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let message = {};

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });

				// Split on SSE record delimiter
				const lines = buffer.split('\n');
				buffer = lines.pop(); // leftover fragment

				for (const line of lines) {
					if (!line.startsWith('data: ')) continue;

					const payload = line.slice(6).trim();
					//console.log('payload', payload);
					if (payload === '[DONE]') {
						//console.log('Stream finished with [DONE]');
						//console.log(`message`, message);
						return;
					}

					const msg = JSON.parse(payload);
					message = messageReducer(message, msg);
					//console.log(msg);

					// Store response_id from SSE event id
					if (msg.id) {
						message.response_id = msg.id;
					}
					//if (msg.choices?.[0]?.delta?.content) {
					if (msg.choices?.[0]?.delta) {
						onToken(msg.choices[0]);
					}
					if (msg.choices?.[0]?.finish_reason) {
						console.log(`onDone message`, message);
						onDone(message);
					}

				}
			}
		} catch (err) {
			if (err.name === 'AbortError') {
				// user cancelled; nothing to do
				return;
			}
			console.error('Error:', err);
		}
	}


	const addMessage = (newMessage) => {
		setMessages(m => {
			const updatedMessages = [...m, newMessage];
			messagesStore.set(updatedMessages);
			return updatedMessages;
		});
	};

	const send = (text) => {
		const value = typeof text === 'string' ? text : draft;
		if (!value.trim()) return;
		const question = { role: 'user', content: value };
		addMessage(question);
		setDraft('');
		widgetStatus.set('sending');
		addMessage({ role: 'assistant', content: '', isStreaming: true, actions: [] });

		ask(question, onToken, onDone);
	};

	function onToken(payload) {
		const { delta } = payload;

		if (delta?.content) {
			setMessages(msgs => {
				const lastIdx = msgs.length - 1;
				const updated = [...msgs];
				const lastMsg = { ...updated[lastIdx] };
				lastMsg.content += delta.content;
				updated[lastIdx] = lastMsg;
				return updated;
			});
		}
		if (delta?.actions) {
			setActions(prev => {
				const updatedActions = [...prev, delta.actions];
				actionsRef.current = updatedActions;
				console.log('Updated actions:', updatedActions);
				return updatedActions;
			});
		}
		if (delta?.reason) {
			widgetReasons.set([...widgetReasons.get(), delta.reason]);
			console.log(`reason`, delta?.reason);
		}
	}

	function onDone(message) {
		setMessages(old => {
			const msgs = [...old];
			// Add accumulated actions to the last assistant message
			msgs[msgs.length - 1] = { 
				...message,
				isStreaming: true,
				role: 'assistant',
				reason: widgetReasons.get(),
				actions: actionsRef.current
			};
			messagesStore.set(msgs);
			console.log('Final assistant message:', msgs[msgs.length - 1]);
			return msgs;
		});
		setActions([]); // Clear actions for next message
		actionsRef.current = [];
		widgetStatus.set('idle');
		abortCtrl.current = null;
	}

	const cancel = () => {
		// abort the fetch/reader
		if (abortCtrl.current) {
			abortCtrl.current.abort();
			abortCtrl.current = null;
		}
		// drop the streaming placeholder
		setMessages(old => {
			const trimmed = old.slice(0, -1);
			if (trimmed.length === 0) {
				const msg = getDefaultAssistantMessage(config);
				messagesStore.set([msg]);
				return [msg];
			}
			messagesStore.set(trimmed);
			return trimmed;
		});
		widgetStatus.set('idle');
	}

	// Detect embedding mode
	const isEmbedding = !!config.target;

	if (!isEmbedding) {
		return (
			<div class="hw-widget-root">
				<>
					<WidgetButton open={open} onToggle={() => setOpen(o => !o)} />
					{open && (
						<div class={`hw-widget open`}>
							<Header config={config} open={open} onToggle={() => setOpen(o => !o)} />
							<div class="hw-body">
								{status === 'closing'
									? (
										<Close onToggle={() => setOpen(o => !o)} />
									)
									: (
										<Messages messages={messages} send={send} />
									)
								}
							</div>
							<Input
								config={config}
								status={status}
								draft={draft}
								setDraft={setDraft}
								send={send}
								cancel={cancel}
							/>
							{!config.noCredits && <Footer />}
						</div>
					)}
				</>
			</div>
		);
	}

	return (
		<>
			{!isEmbedding && (
				<WidgetButton open={open} onToggle={() => setOpen(o => !o)} />
			)}
			{open && (
				<div class={`hw-widget open`}>
					<Header config={config} open={open} onToggle={() => setOpen(o => !o)} />
					<div class="hw-body">
						{status === 'closing'
							? (
								<Close onToggle={() => setOpen(o => !o)} />
							)
							: (
								<Messages messages={messages} send={send} />
							)
						}
					</div>
					<Input
						config={config}
						status={status}
						draft={draft}
						setDraft={setDraft}
						send={send}
						cancel={cancel}
					/>
					{!config.noCredits && <Footer config={config} />}
				</div>
			)}
		</>
	);
}
