# 🗂️ Sistema Inteligente de Categorização - SVGaze

Este documento explica como funciona o sistema inteligente de categorização do SVGaze.

## 🎯 Objetivo

O sistema de categorização foi projetado para ser **inteligente e flexível**, funcionando com diferentes estruturas de organização de pastas de ícones.

### Problemas Resolvidos

✅ **Ignora pastas de estilo** - Outline, Solid, Fill não viram categorias
✅ **Detecta categorias semânticas** - Brands, Communication, Devices
✅ **Unifica categorias duplicadas** - Devices/Outline + Devices/Solid = 1 categoria
✅ **Mostra badges de estilo** - Indica se é Solid, Outline, Fill, etc
✅ **Funciona com múltiplas estruturas** - Adapta-se automaticamente

---

## 📁 Estruturas Suportadas

### Estrutura 1: Categoria → Estilo
```
Icons/
├── arrow/              → Categoria: arrow
│   ├── Fill/          → Estilo: Fill
│   │   ├── arrow-left.svg
│   │   └── arrow-right.svg
│   └── Outline/       → Estilo: Outline
│       └── arrow-up.svg
├── social/            → Categoria: social
│   ├── facebook.svg   → Estilo: (detectado do SVG)
│   └── twitter.svg
└── ui/                → Categoria: ui
    └── close.svg
```

**Resultado:**
- **Categorias**: arrow, social, ui
- **Badges**: Fill, Outline (exibidos nos cards)

---

### Estrutura 2: Estilo → Categoria
```
svg/
├── Outline/           → Ignorado (pasta de estilo)
│   ├── Brands/       → Categoria: Brands
│   │   ├── Adobe-After-effects.svg
│   │   └── Adobe-Illustrator.svg
│   ├── Communication/ → Categoria: Communication
│   │   ├── Comment.svg
│   │   └── Contacts.svg
│   └── Devices/       → Categoria: Devices
│       ├── Battery-empty.svg
│       └── Camera.svg
├── Solid/             → Ignorado (pasta de estilo)
│   ├── Brands/       → Categoria: Brands (unificada)
│   │   ├── Adobe-After-effects.svg
│   │   └── Adobe-Illustrator.svg
│   ├── Communication/ → Categoria: Communication (unificada)
│   │   ├── Comment.svg
│   │   └── Contacts.svg
│   └── Devices/       → Categoria: Devices (unificada)
│       ├── Battery-empty.svg
│       └── Camera.svg
```

**Resultado:**
- **Categorias**: Brands, Communication, Devices (unificadas!)
- **Badges**: Outline, Solid (exibidos nos cards)
- Ao selecionar "Devices", mostra ícones de ambas as pastas Devices/

---

### Estrutura 3: Mista
```
icons/
├── ui/
│   ├── Outline/
│   │   └── close.svg    → Categoria: ui, Estilo: Outline
│   └── Solid/
│       └── close.svg    → Categoria: ui, Estilo: Solid
└── brands/
    └── figma.svg        → Categoria: brands, Estilo: (auto)
```

**Resultado:**
- **Categorias**: ui, brands
- **Badges**: Outline, Solid

---

## 🧠 Como Funciona

### 1. Detecção de Pastas de Estilo

O sistema reconhece automaticamente estas pastas como "estilo":

```javascript
'outline', 'solid', 'fill', 'filled', 'line', 'duotone',
'bold', 'regular', 'light', 'thin', 'sharp', 'rounded', 'straight'
```

Essas pastas são **ignoradas** ao determinar categorias.

### 2. Detecção de Pastas Raiz

Estas pastas são consideradas "container" e ignoradas:

```javascript
'icons', 'svg', 'svgs', 'assets', 'images'
```

### 3. Algoritmo de Categorização

```
Para cada arquivo SVG:
  1. Pega o caminho completo: "svg/Outline/Brands/Adobe.svg"
  2. Remove a pasta raiz: "Outline/Brands/Adobe.svg"
  3. Identifica pastas de estilo: ["Outline"]
  4. Identifica pastas semânticas: ["Brands"]
  5. Categoria = primeira pasta semântica: "Brands"
  6. Estilo = primeira pasta de estilo: "Outline"
  7. Subcategoria = pastas semânticas restantes
```

### 4. Unificação de Categorias

```javascript
// Antes (sem unificação):
Categorias: [Outline, Solid]
  Outline → Brands, Communication, Devices
  Solid → Brands, Communication, Devices

// Depois (com unificação):
Categorias: [Brands, Communication, Devices]
  Brands → [Outline icons, Solid icons]
  Communication → [Outline icons, Solid icons]
  Devices → [Outline icons, Solid icons]
```

### 5. Detecção Automática de Estilo (Fallback)

Se o estilo não estiver no nome da pasta, o sistema analisa o **conteúdo do SVG**:

```javascript
// Analisa elementos <path>, <circle>, etc
- Se maioria tem stroke e pouco fill → "Outline"
- Se maioria tem fill → "Solid"
- Se tem fill E stroke → "Duotone"
```

---

## 🎨 Badges de Estilo

Os cards exibem badges indicando o estilo:

```
┌─────────────────────┐
│   [Ícone Preview]   │
│                     │
│  Adobe Illustrator  │
│  [Brands] [Outline] │ ← Badges
│  [Copy] [Download]  │
└─────────────────────┘
```

**Tipos de Badge:**
- **Categoria secundária** (cinza): "Brands", "Communication"
- **Estilo** (azul): "Outline", "Solid", "Fill"

---

## ⚙️ API do Sistema

### Funções Principais

#### `parseFilePath(path, fileName)`
Analisa o caminho e extrai categoria, estilo e metadados.

```javascript
const info = parseFilePath('svg/Outline/Brands/Adobe.svg', 'Adobe.svg');
// {
//   category: 'Brands',
//   style: 'Outline',
//   subcategory: '',
//   fullPath: 'Outline › Brands',
//   originalPath: 'svg/Outline/Brands/Adobe.svg'
// }
```

#### `detectStyleFromSVG(svgElement)`
Detecta estilo analisando o conteúdo do SVG.

```javascript
const style = detectStyleFromSVG(svgElement);
// 'Outline' | 'Solid' | 'Duotone' | ''
```

#### `groupByCategory(items)`
Agrupa ícones por categoria.

```javascript
const grouped = groupByCategory(allItems);
// {
//   'Brands': [...],
//   'Communication': [...],
//   'Devices': [...]
// }
```

#### `getCategoryStats(items)`
Retorna estatísticas sobre categorias e estilos.

```javascript
const stats = getCategoryStats(allItems);
// {
//   totalItems: 145,
//   totalCategories: 8,
//   totalStyles: 2,
//   categories: {
//     'Brands': { count: 24, styles: ['Outline', 'Solid'] },
//     'Communication': { count: 18, styles: ['Outline', 'Solid'] }
//   }
// }
```

### Customização

#### Adicionar pastas de estilo personalizadas:
```javascript
categoryManager.addStyleFolders(['custom-style', 'special']);
```

#### Remover pastas de estilo:
```javascript
categoryManager.removeStyleFolders(['duotone']);
```

#### Ver lista atual:
```javascript
const styles = categoryManager.getStyleFolders();
// ['outline', 'solid', 'fill', ...]
```

#### Resetar para padrão:
```javascript
categoryManager.resetStyleFolders();
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Processar arquivo
```javascript
import { parseFilePath, detectStyleFromSVG } from './categoryManager.js';

// Processar path
const pathInfo = parseFilePath(
  'Icons/Outline/Communication/Comment.svg',
  'Comment.svg'
);

console.log(pathInfo);
// {
//   category: 'Communication',
//   style: 'Outline',
//   subcategory: '',
//   fullPath: 'Outline › Communication'
// }

// Detectar estilo do SVG
const svgEl = parser.parseFromString(svgText, 'image/svg+xml').querySelector('svg');
const detectedStyle = detectStyleFromSVG(svgEl);
console.log(detectedStyle); // 'Outline'

// Usar estilo detectado se não tiver na pasta
const finalStyle = pathInfo.style || detectedStyle;
```

### Exemplo 2: Agrupar e estatísticas
```javascript
import { groupByCategory, getCategoryStats } from './categoryManager.js';

// Agrupar por categoria
const grouped = groupByCategory(allItems);

// Para cada categoria, mostrar quantos ícones
Object.entries(grouped).forEach(([category, items]) => {
  console.log(`${category}: ${items.length} ícones`);

  // Estilos disponíveis nessa categoria
  const styles = new Set(items.map(i => i.style).filter(Boolean));
  console.log(`  Estilos: ${Array.from(styles).join(', ')}`);
});

// Estatísticas gerais
const stats = getCategoryStats(allItems);
console.log(`Total: ${stats.totalItems} ícones`);
console.log(`Categorias: ${stats.totalCategories}`);
console.log(`Estilos: ${stats.totalStyles}`);
```

---

## 🔧 Integração com o App

### Atualizar o handleFiles() no index.html:

```javascript
import { parseFilePath, detectStyleFromSVG } from './js/modules/categoryManager.js';

function handleFiles(e) {
  const files = Array.from(e.target.files || []);
  const svgFiles = files.filter(f => f.name.endsWith('.svg'));

  const readPromises = svgFiles.map(file => readFile(file).then(text => {
    const path = file.webkitRelativePath || file.name;
    const fileName = path.split('/').pop();

    // Usar o novo sistema de categorização
    const pathInfo = parseFilePath(path, fileName);

    // Parse SVG para detectar estilo se necessário
    const svgParsed = parseAndSanitizeSVG(text);
    const detectedStyle = detectStyleFromSVG(svgParsed);

    // Combinar: usar estilo da pasta OU detectado
    const finalStyle = pathInfo.style || detectedStyle;

    return {
      category: pathInfo.category,
      style: finalStyle,
      subcategory: pathInfo.subcategory,
      fullPath: pathInfo.fullPath,
      fileName,
      svgText: text,
      svgElement: svgParsed,
      originalPath: path
    };
  }));

  Promise.all(readPromises).then(items => {
    allItems = items;
    populateCategoryFilter();
    renderGrid();
  });
}
```

---

## 📊 Testes

### Estruturas para Testar

1. **Icons → Category → Style**
   ```
   Icons/arrow/Fill/arrow-left.svg
   Icons/arrow/Outline/arrow-up.svg
   ```
   ✅ Categoria: arrow
   ✅ Estilos: Fill, Outline

2. **Style → Category**
   ```
   svg/Outline/Brands/Adobe.svg
   svg/Solid/Brands/Adobe.svg
   ```
   ✅ Categoria: Brands (unificada)
   ✅ Estilos: Outline, Solid

3. **Flat (sem subcategorias)**
   ```
   icons/close.svg
   icons/menu.svg
   ```
   ✅ Categoria: Root
   ✅ Estilo: (auto-detectado)

---

## 🎯 Benefícios

✅ **Flexível** - Funciona com qualquer estrutura de pastas
✅ **Inteligente** - Detecta e ignora pastas de estilo automaticamente
✅ **Unificado** - Categorias duplicadas são mescladas
✅ **Visual** - Badges mostram claramente o estilo
✅ **Extensível** - Fácil adicionar novos estilos ou customizar
✅ **Robusto** - Fallback para detecção automática de estilo

---

## 🚀 Próximos Passos

1. ✅ Módulo criado (`categoryManager.js`)
2. ⏳ Integrar no `index.html`
3. ⏳ Atualizar UI para mostrar badges de estilo
4. ⏳ Adicionar filtro de estilo no header
5. ⏳ Testar com diferentes estruturas de pastas
6. ⏳ Documentar no README

---

**Última atualização:** 2025-01-05
**Status:** ✅ Módulo implementado, aguardando integração
