/**
 * SVGaze - SVG Processor
 *
 * Parse, sanitize, and process SVG files.
 * Security-focused to prevent XSS attacks.
 */

import { logError } from './utils.js';
import { isSVGMonochromatic } from './svgColorDetector.js';

/**
 * Parse and sanitize SVG text
 * Removes scripts, event handlers, external content, and other security risks
 *
 * @param {string} svgText - Raw SVG text
 * @returns {SVGElement|null} Sanitized SVG element or null if invalid
 */
export function parseAndSanitizeSVG(svgText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');

    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      logError('SVG Parsing', new Error('Parse error'), {
        errorText: parseError.textContent
      });
      return null;
    }

    const svg = doc.querySelector('svg');
    if (!svg) {
      logError('SVG Parsing', new Error('No SVG element found'));
      return null;
    }

    // SECURITY: Remove scripts
    svg.querySelectorAll('script').forEach(n => n.remove());

    // SECURITY: Remove foreignObject and iframe
    svg.querySelectorAll('foreignObject, iframe').forEach(n => n.remove());

    // SECURITY: Remove event handlers and javascript: hrefs
    const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const attrs = Array.from(el.attributes || []);

      for (const attr of attrs) {
        // Remove onXXX event handlers
        if (/^on/i.test(attr.name)) {
          el.removeAttribute(attr.name);
        }

        // Remove javascript: in href
        if ((attr.name === 'href' || attr.name === 'xlink:href') &&
            /javascript:/i.test(attr.value)) {
          el.removeAttribute(attr.name);
        }
      }
    }

    // SECURITY: Remove external images
    svg.querySelectorAll('image').forEach(img => {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href') || '';
      if (/^https?:\/\//i.test(href)) {
        img.remove();
      }
    });

    // Set defaults
    if (!svg.getAttribute('preserveAspectRatio')) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
    svg.style.overflow = 'visible';

    return svg;
  } catch (error) {
    logError('SVG Sanitization', error);
    return null;
  }
}

/**
 * Ensure SVG has a valid viewBox attribute
 * Falls back to calculating from dimensions or bounding box
 *
 * @param {SVGElement} svgEl - SVG element to process
 */
export function ensureViewBox(svgEl) {
  if (!svgEl) return;

  // Already has viewBox
  if (svgEl.getAttribute('viewBox')) return;

  // Try to use width/height attributes
  const rawW = svgEl.getAttribute('width') || svgEl.getAttribute('data-width') || '';
  const rawH = svgEl.getAttribute('height') || svgEl.getAttribute('data-height') || '';
  const numW = parseFloat(String(rawW).replace(/[^0-9.]/g, '')) || 0;
  const numH = parseFloat(String(rawH).replace(/[^0-9.]/g, '')) || 0;

  if (numW && numH) {
    svgEl.setAttribute('viewBox', `0 0 ${numW} ${numH}`);
    return;
  }

  // Try to calculate bounding box
  try {
    // Create temporary container off-screen
    const tempWrap = document.createElement('div');
    tempWrap.style.position = 'absolute';
    tempWrap.style.left = '-9999px';
    tempWrap.style.top = '-9999px';
    tempWrap.style.width = '0';
    tempWrap.style.height = '0';
    tempWrap.style.overflow = 'hidden';

    const clone = svgEl.cloneNode(true);
    clone.removeAttribute('width');
    clone.removeAttribute('height');

    tempWrap.appendChild(clone);
    document.body.appendChild(tempWrap);

    // Get bounding box
    let bbox;
    try {
      bbox = clone.getBBox();
    } catch (e) {
      bbox = null;
    }

    // Clean up
    document.body.removeChild(tempWrap);

    if (bbox && bbox.width && bbox.height) {
      svgEl.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
    } else {
      // Fallback to default
      svgEl.setAttribute('viewBox', '0 0 100 100');
    }
  } catch (error) {
    // Final fallback
    svgEl.setAttribute('viewBox', '0 0 100 100');
    logError('ViewBox Calculation', error);
  }
}

/**
 * Resolve CSS-defined colors to inline attributes
 * Handles SVGs that use <style> tags and CSS classes instead of inline colors
 * @param {SVGElement} svgEl - SVG element to process
 */
function resolveCSSStylesToAttributes(svgEl) {
  if (!svgEl) return;

  try {
    const walker = document.createTreeWalker(svgEl, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
      const el = walker.currentNode;
      const className = el.getAttribute('class');

      if (!className) continue;

      // Find all <style> tags in the SVG
      const styleElements = svgEl.querySelectorAll('style');
      styleElements.forEach(styleEl => {
        const cssText = styleEl.textContent;

        // Extract CSS rules for this class (escape special regex characters)
        const escapedClassName = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const classRegex = new RegExp(`\\.${escapedClassName}\\s*\\{([^}]+)\\}`, 'g');
        const matches = cssText.match(classRegex);

        if (matches) {
          matches.forEach(rule => {
            const fillMatch = rule.match(/fill:\s*([^;}\s]+)/);
            const strokeMatch = rule.match(/stroke:\s*([^;}\s]+)/);

            if (fillMatch && fillMatch[1] !== 'none' && fillMatch[1] !== 'transparent') {
              // Remove the class and apply fill as inline attribute
              el.removeAttribute('class');
              el.setAttribute('fill', fillMatch[1]);
            }
            if (strokeMatch && strokeMatch[1] !== 'none' && strokeMatch[1] !== 'transparent') {
              el.setAttribute('stroke', strokeMatch[1]);
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error resolving CSS styles to attributes:', error);
  }
}

/**
 * Apply currentColor to SVG elements for color control
 * Replaces fill and stroke colors with currentColor to enable CSS color control
 * Only applies to monochromatic SVGs - multicolor SVGs preserve original colors
 *
 * @param {SVGElement} svgEl - SVG element to process
 */
export function applyCurrentColorToSVG(svgEl) {
  if (!svgEl) return;

  // FIRST: Resolve CSS classes to inline attributes before color detection
  resolveCSSStylesToAttributes(svgEl);

  // Remove fill="none" from root SVG element to allow children to inherit color
  if (svgEl.getAttribute('fill') === 'none') {
    svgEl.removeAttribute('fill');
    console.log('🔧 Removed fill="none" from root SVG');
  }

  // Detect if SVG is monochromatic or multicolor
  if (!isSVGMonochromatic(svgEl)) {
    console.log('🎨 Multicolor SVG detected - preserving original colors');
    return; // Skip color transformation for multicolor SVGs
  }

  console.log('✅ Monochromatic SVG - applying currentColor');

  try {
    const walker = document.createTreeWalker(svgEl, NodeFilter.SHOW_ELEMENT);
    const fillableTags = ['path', 'circle', 'rect', 'ellipse', 'polygon', 'polyline'];
    const strokeableTags = ['path', 'line', 'polyline', 'circle', 'rect', 'ellipse', 'polygon'];
    let processedElements = 0;

    while (walker.nextNode()) {
      const el = walker.currentNode;
      const tag = el.tagName.toLowerCase();

      // Skip non-visual elements
      const skipTags = ['svg', 'defs', 'style', 'metadata', 'title', 'desc',
                        'clippath', 'mask', 'pattern', 'lineargradient',
                        'radialgradient'];
      if (skipTags.includes(tag)) continue;

      const fill = el.getAttribute('fill');
      const stroke = el.getAttribute('stroke');
      const initialFill = fill;

      // Handle stroke first
      if (stroke !== null && stroke.trim().toLowerCase() !== 'none') {
        el.setAttribute('stroke', 'currentColor');
      }

      // Handle fill
      if (fill !== null) {
        const fillValue = fill.trim().toLowerCase();
        // Don't replace 'none' or 'transparent', but replace everything else including hardcoded colors
        if (fillValue !== 'none' && fillValue !== 'transparent') {
          el.setAttribute('fill', 'currentColor');
          processedElements++;
          console.log(`  → ${tag} (${initialFill} → currentColor)`);
        }
      } else if (fillableTags.includes(tag)) {
        // Check if element has stroke - if yes, it's likely stroke-only
        const hasStroke = stroke !== null && stroke.trim().toLowerCase() !== 'none';

        if (hasStroke) {
          // Stroke-only element - explicitly set fill to none
          el.setAttribute('fill', 'none');
        } else {
          // No stroke - this is a filled element, add currentColor
          el.setAttribute('fill', 'currentColor');
          processedElements++;
          console.log(`  → ${tag} (no fill → currentColor)`);
        }
      }
    }

    console.log(`📊 Processed ${processedElements} elements`);
  } catch (error) {
    logError('Apply CurrentColor', error);
  }
}

/**
 * Get SVG text representation (for copying or exporting)
 *
 * @param {Object} item - SVG item object
 * @returns {string} SVG text
 */
export function getSVGText(item) {
  // Prefer svgText as it contains the original SVG with dimensions
  if (item.svgText) {
    return item.svgText;
  }
  if (item.svgElement) {
    return item.svgElement.outerHTML;
  }
  return '';
}

/**
 * Prepare SVG for display (clone and apply settings)
 *
 * @param {SVGElement} svgElement - Original SVG element
 * @param {number} size - Display size in pixels
 * @param {string} color - Color value
 * @returns {SVGElement} Prepared SVG element
 */
export function prepareSVGForDisplay(svgElement, size = 72, color = '#000000') {
  if (!svgElement) return null;

  const clone = svgElement.cloneNode(true);

  // Apply color
  clone.style.color = color;

  // Apply size
  clone.style.width = `${size}px`;
  clone.style.height = `${size}px`;

  // Ensure aspect ratio is preserved
  clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  clone.style.display = 'block';

  return clone;
}

export default {
  parseAndSanitizeSVG,
  ensureViewBox,
  applyCurrentColorToSVG,
  getSVGText,
  prepareSVGForDisplay
};
