import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

/**
 * Input component for the copilot widget.
 *
 * @param {Object} props
 * @param {Object} props.config - General configurations on widget init. E.g., placeholder text.
 * @param {string} props.status - One of 'idle', 'sending', 'paused', etc.
 * @param {string} props.draft - Current input value.
 * @param {function} props.setDraft - Setter for draft state.
 * @param {function} props.send - Function to send the message.
 * @param {function} props.cancel - Function to cancel the send operation.
 */
export function Input({ config, status, draft, setDraft, send, cancel }) {
    const textareaRef = useRef(null);

    // Adjust height of textarea to fit content
    const autosize = () => {
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            ta.style.height = `${ta.scrollHeight}px`;
        }
    };

    // Re-run autosize whenever the draft changes
    useEffect(() => {
        autosize();
    }, [draft]);

    // When status becomes 'idle', focus the textarea
    useEffect(() => {
        if (status === 'idle' && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [status]);

    const handleInput = e => {
        const value = e.currentTarget.value;
        setDraft(value);
        if (config.__dispatch) config.__dispatch('sst:typing', { value });
    };

    const handleKeyDown = e => {
        // Send on Enter, allow Shift+Enter for newline
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
            if (config.__dispatch) config.__dispatch('sst:typing:submit');
        }
    };

    const isSending = status === 'sending';

    return (
        <div className="widget-input">
            <div className="input-area">
                <textarea
                    ref={textareaRef}
                    value={draft}
                    placeholder={isSending ? '...' : (config.placeholder || 'Ask copilot...')}
                    disabled={isSending}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />

                {isSending ? (
                    <button onClick={cancel} className="cancel-btn">
                        <span className="icon" />
                    </button>
                ) : (
                    <button onClick={send} className="send-btn">
                        <span className="icon" />
                    </button>
                )}
            </div>
        </div>
    );
}
