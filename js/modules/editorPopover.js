// Anchor editor settings without changing the application's visual tokens.
export function placeEditorPopover(panel, anchor, width = 360) {
  const rect = anchor.getBoundingClientRect();
  const top = Math.min(rect.bottom + 6, Math.max(8, window.innerHeight - 240));
  const actualWidth = Math.min(width, window.innerWidth - 16);
  Object.assign(panel.style, {
    position: 'fixed',
    top: top + 'px',
    left:
      Math.max(8, Math.min(rect.right - actualWidth, window.innerWidth - actualWidth - 8)) + 'px',
    width: actualWidth + 'px',
    maxHeight: Math.max(200, window.innerHeight - top - 8) + 'px',
  });
}
