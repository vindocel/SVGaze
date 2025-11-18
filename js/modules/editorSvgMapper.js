/**
 * SVGaze - Editor SVG Mapper
 *
 * Creates bidirectional mapping between SVG code lines and rendered elements
 * Enables interactive hover highlighting between code editor and preview
 */

// Mapping data structure
let lineToElementMap = new Map(); // line number -> element IDs
let elementToLineMap = new Map(); // element ID -> {start, end}
let svgElements = new Map();      // element ID -> DOM element

/**
 * Parse SVG code and create line-to-element mapping
 * @param {string} svgCode - SVG source code
 * @returns {object} - Mapping data
 */
export function parseSvgCode(svgCode) {
  console.log('🗺️ Parsing SVG code for mapping...');

  // Reset maps
  lineToElementMap.clear();
  elementToLineMap.clear();
  svgElements.clear();

  const lines = svgCode.split('\n');
  let elementCounter = 0;

  // Track opening tags and their line numbers
  const openTagRegex = /<(\w+)([^>]*?)>/g;
  const selfClosingRegex = /<(\w+)([^>]*?)\/>/g;
  const closingTagRegex = /<\/(\w+)>/g;

  // Stack to track nested elements
  const elementStack = [];

  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1; // 1-based line numbers

    // Check for self-closing tags (e.g., <circle ... />)
    const selfClosingMatches = [...line.matchAll(selfClosingRegex)];
    selfClosingMatches.forEach(match => {
      const tagName = match[1];
      if (isSvgElement(tagName)) {
        const elementId = `svg-el-${elementCounter}`;
        console.log(`📍 Line ${lineNum}: Found self-closing <${tagName}/> → ID: ${elementId}`);
        elementCounter++;

        // Map: line -> element
        if (!lineToElementMap.has(lineNum)) {
          lineToElementMap.set(lineNum, []);
        }
        lineToElementMap.get(lineNum).push(elementId);

        // Map: element -> line
        elementToLineMap.set(elementId, {
          start: lineNum,
          end: lineNum,
          tag: tagName
        });
      }
    });

    // Check for opening tags
    const openMatches = [...line.matchAll(openTagRegex)];
    openMatches.forEach(match => {
      const tagName = match[1];
      // Skip self-closing tags (already handled) and svg root
      if (!match[0].endsWith('/>') && isSvgElement(tagName) && tagName !== 'svg') {
        const elementId = `svg-el-${elementCounter}`;
        console.log(`📍 Line ${lineNum}: Found opening <${tagName}> → ID: ${elementId}`);
        elementCounter++;

        elementStack.push({
          id: elementId,
          tag: tagName,
          startLine: lineNum
        });

        // Map: line -> element
        if (!lineToElementMap.has(lineNum)) {
          lineToElementMap.set(lineNum, []);
        }
        lineToElementMap.get(lineNum).push(elementId);
      }
    });

    // Check for closing tags
    const closeMatches = [...line.matchAll(closingTagRegex)];
    closeMatches.forEach(match => {
      const tagName = match[1];
      if (isSvgElement(tagName) && tagName !== 'svg') {
        // Find matching opening tag in stack
        for (let i = elementStack.length - 1; i >= 0; i--) {
          if (elementStack[i].tag === tagName) {
            const element = elementStack.splice(i, 1)[0];

            console.log(`📍 Line ${lineNum}: Found closing </${tagName}> for ID: ${element.id} (lines ${element.startLine}-${lineNum})`);

            // Map: element -> lines (start to end)
            elementToLineMap.set(element.id, {
              start: element.startLine,
              end: lineNum,
              tag: tagName
            });

            // Add end line to lineToElementMap
            if (!lineToElementMap.has(lineNum)) {
              lineToElementMap.set(lineNum, []);
            }
            if (!lineToElementMap.get(lineNum).includes(element.id)) {
              lineToElementMap.get(lineNum).push(element.id);
            }

            break;
          }
        }
      }
    });
  });

  console.log(`✅ Mapping complete: ${elementCounter} elements found`);
  console.log('📊 Line → Element map:', lineToElementMap);
  console.log('📊 Element → Line map:', elementToLineMap);

  return {
    lineToElement: lineToElementMap,
    elementToLine: elementToLineMap,
    totalElements: elementCounter
  };
}

/**
 * Check if tag name is an SVG element
 * @param {string} tagName - HTML tag name
 * @returns {boolean}
 */
function isSvgElement(tagName) {
  const svgElements = [
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line',
    'polyline', 'polygon', 'text', 'tspan', 'image', 'use',
    'defs', 'clipPath', 'mask', 'pattern', 'linearGradient',
    'radialGradient', 'stop', 'symbol', 'marker', 'animate',
    'animateTransform', 'animateMotion'
  ];
  return svgElements.includes(tagName.toLowerCase());
}

/**
 * Apply data attributes to rendered SVG elements
 * @param {SVGElement} svgRoot - Root SVG element
 * @param {Map} elementToLineMap - Mapping of element IDs to line ranges
 */
export function applyDataAttributes(svgRoot, mapping) {
  if (!svgRoot || !mapping) return;

  console.log('🏷️ Applying data attributes to SVG elements...');
  console.log('   Mapping has', mapping.elementToLine.size, 'element mappings');

  const elementToLineMap = mapping.elementToLine;
  let elementIndex = 0;

  // Traverse all SVG elements
  const finalIndex = traverseAndTag(svgRoot, elementToLineMap, elementIndex);

  console.log(`✅ Data attributes applied to ${svgElements.size} elements (traversed ${finalIndex} elements)`);
}

/**
 * Recursively traverse SVG tree and apply data attributes
 * @param {Element} element - Current element
 * @param {Map} elementToLineMap - Mapping data
 * @param {number} index - Current element index
 * @returns {number} - Updated index
 */
function traverseAndTag(element, elementToLineMap, index) {
  const tagName = element.tagName.toLowerCase();

  if (isSvgElement(tagName) && tagName !== 'svg') {
    const elementId = `svg-el-${index}`;
    const lineInfo = elementToLineMap.get(elementId);

    console.log(`   [${index}] Checking <${tagName}> with ID ${elementId}:`, lineInfo ? `lines ${lineInfo.start}-${lineInfo.end}` : 'NO MAPPING');

    if (lineInfo) {
      element.setAttribute('data-svg-id', elementId);
      element.setAttribute('data-line-start', lineInfo.start);
      element.setAttribute('data-line-end', lineInfo.end);
      element.classList.add('svg-interactive-element');

      // Store element reference
      svgElements.set(elementId, element);
      console.log(`   ✅ Applied data attributes to ${elementId}`);
    } else {
      console.log(`   ⚠️ Skipping ${elementId} - no line mapping found`);
    }

    index++;
  }

  // Traverse children
  for (let child of element.children) {
    index = traverseAndTag(child, elementToLineMap, index);
  }

  return index;
}

/**
 * Get elements for a specific line number
 * @param {number} lineNum - Line number (1-based)
 * @returns {Array<Element>} - Array of DOM elements
 */
export function getElementsForLine(lineNum) {
  const elementIds = lineToElementMap.get(lineNum) || [];
  console.log(`🔎 getElementsForLine(${lineNum}):`, elementIds);

  const elements = elementIds
    .map(id => svgElements.get(id))
    .filter(el => el !== undefined);

  console.log(`   → Returning ${elements.length} DOM elements`);
  return elements;
}

/**
 * Get line range for a specific element
 * @param {string} elementId - Element ID
 * @returns {object|null} - {start, end, tag} or null
 */
export function getLineRangeForElement(elementId) {
  return elementToLineMap.get(elementId) || null;
}

/**
 * Get all mapped elements
 * @returns {Map} - Map of element IDs to DOM elements
 */
export function getAllElements() {
  return svgElements;
}

/**
 * Clear all mappings
 */
export function clearMappings() {
  lineToElementMap.clear();
  elementToLineMap.clear();
  svgElements.clear();
}

export default {
  parseSvgCode,
  applyDataAttributes,
  getElementsForLine,
  getLineRangeForElement,
  getAllElements,
  clearMappings
};
