import { widgetStatus } from "../Widget";

export function Header({ config, open, onToggle }) {
	if (!config?.header) return null;
	return (
		<div class="hw-header" onClick={onToggle}>
			{open && (
				<div class="hw-header-wrap">
					<span class="hw-header-title">Chat with us</span>
					<div class="hw-header-buttons">
						<span class="minimize-btn" onClick={e => {
							e.stopPropagation();
							onToggle();
							widgetStatus.set('idle');
			              }}
						/>
						<span class="close-btn" onClick={e => {
							e.stopPropagation();
							widgetStatus.set('closing');
						}}></span>
					</div>
				</div>
			)}
		</div>
	);
}
