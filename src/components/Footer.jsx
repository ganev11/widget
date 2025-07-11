import { h } from 'preact';

export function Footer({ config }) {
  if (!config?.footer == false) return null;
  return (
    <footer class="hw-footer">
      Powered by <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">example.com</a>
    </footer>
  );
}
