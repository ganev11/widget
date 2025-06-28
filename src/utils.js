//https://github.com/openai/openai-node/blob/2785c1186b528e4ab3a2a7c9282e041aaa4c13f6/examples/tool-calls-stream.ts#L160
export function messageReducer(previous, item) {
	const reduce = (acc, delta) => {
		acc = { ...acc };
		for (const [key, value] of Object.entries(delta)) {
			if (acc[key] === undefined || acc[key] === null) {
				acc[key] = value;
				//  OpenAI.Chat.Completions.ChatCompletionMessageToolCall does not have a key, .index
				if (Array.isArray(acc[key])) {
					for (const arr of acc[key]) {
						delete arr.index;
					}
				}
			} else if (typeof acc[key] === 'string' && typeof value === 'string') {
				acc[key] += value;
			} else if (typeof acc[key] === 'number' && typeof value === 'number') {
				acc[key] = value;
			} else if (Array.isArray(acc[key]) && Array.isArray(value)) {
				const accArray = acc[key];
				for (let i = 0; i < value.length; i++) {
					const { index, ...chunkTool } = value[i];
					if (index - accArray.length > 1) {
						throw new Error(
							`Error: An array has an empty value when tool_calls are constructed. tool_calls: ${accArray}; tool: ${value}`,
						);
					}
					accArray[index] = reduce(accArray[index], chunkTool);
				}
			} else if (typeof acc[key] === 'object' && typeof value === 'object') {
				acc[key] = reduce(acc[key], value);
			}
		}
		return acc;
	};

	const choice = item.choices[0];
	if (!choice) {
		// chunk contains information about usage and token counts
		return previous;
	}
	return reduce(previous, choice.delta);
}

export function toMessagesArray(messages) {
    const result = [];
    for (const message of messages) {
        if (message.role === 'user') {
            result.push({ role: 'user', content: message.content });
        } else if (message.role === 'assistant') {
            result.push({ role: 'assistant', content: message.content });
        }
    }
    return result;
}