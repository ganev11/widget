import { h } from 'preact';

export function WidgetButton({ open, onToggle }) {
  return (
    <div class={`hw-widget-btn ${open ? 'open' : 'minimized'}`} onClick={onToggle}>
      
    </div>
  );
}
