import { getEditorContent, setEditorContent } from './editorCodeManager.js';
import { transformSvg } from './editorSvgCore.js';
import { showToast } from './toast.js';
export function initTransformManager() {
  for (const [id, operation] of [
    ['transformRotate', 'rotate'],
    ['transformFlipX', 'x'],
    ['transformFlipY', 'y'],
  ])
    document.getElementById(id)?.addEventListener('click', () => {
      try {
        setEditorContent(transformSvg(getEditorContent(), operation));
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
}
