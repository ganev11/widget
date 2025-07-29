
export function getDefaultAssistantMessage(config) {
	if (config && config.defaultAssistantMessage) {
		const { content, actions } = config.defaultAssistantMessage;
		let selectedActions = actions;
		if (Array.isArray(actions) && actions.length > 3) {
			// Pick 3 random questions
			selectedActions = actions
				.slice() // copy
				.sort(() => Math.random() - 0.5)
				.slice(0, 3);
		}
		return {
			role: 'welcome',
			content: content || 'Hello! How can I help you?',
			actions: selectedActions || []
		};
	}
	// fallback to hardcoded default
	return {
		role: 'welcome',
		content: 'Hello! How can I help you?',
		actions: [
			{
				type: 'question',
				text: 'Predict top football match from Sweden.'
			},
			{
				type: 'question',
				text: "predict Panathinaikos - Rangers"
			},
			{
				type: 'question',
				text: "Show me the chances for Hacken vs Anderlecht that both teams will score"
			}
		]
	};
}
