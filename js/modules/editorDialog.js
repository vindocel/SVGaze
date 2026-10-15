// Shared keyboard behavior for local editor dialogs and side panels.
export function manageEditorDialog(container, close) {
  const previous = document.activeElement;
  container.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key !== "Tab") return;
    const nodes = [
      ...container.querySelectorAll(
        'button,input,select,textarea,[tabindex="0"]',
      ),
    ].filter((node) => !node.disabled && !node.closest("[hidden]"));
    const first = nodes[0],
      last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  container.querySelector("button,input")?.focus();
  return () => {
    container.remove();
    previous?.focus();
  };
}
