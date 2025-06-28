import { useEffect, useRef } from "preact/hooks";
import { widgetReasons } from "../Widget";

import { useStore } from "@nanostores/preact";

export function Reasons({ containerRef }) {
	const reasons = useStore(widgetReasons);
	const reason = reasons[reasons.length - 1] || null;

	useEffect(() => {
		const el = containerRef.current;
		// jump straight to the bottom
		el.scrollTop = el.scrollHeight;
	}, [reason]); 

	//console.log('Reasons', reasons, reason);

	return (
		<>
		{(reason &&
			<div class="hw-msg">
				<div class="shimmer-container">
					<div class="shimmer-overlay">
						{reason.text}
					</div>
					{reason.text}
				</div>
			</div>
			)}
		</>
	);
}
