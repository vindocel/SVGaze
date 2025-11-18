# SVGaze 🔍

> Visualizador e editor moderno de ícones SVG — totalmente local, sem upload, 100% privacidade

**SVGaze** é uma aplicação web open-source que permite visualizar, organizar, editar e exportar arquivos SVG locais diretamente no navegador, sem necessidade de upload ou backend. Ideal para designers e desenvolvedores que trabalham com coleções de ícones, ilustrações ou vetores em formato SVG.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://app.svgaze.com)

---

## ✨ Recursos Principais

### 🎯 Visualização Inteligente
- **Galeria responsiva** com grid adaptativo
- **Preview em tempo real** de todos os SVGs da pasta
- **Modal de visualização ampliada** para análise detalhada
- **Categorização inteligente** — detecta categorias semânticas vs estilos ([detalhes](docs/CATEGORIZATION.md))
- **Badges de estilo** — Outline, Solid, Fill automáticos nos cards
- **Unificação de categorias** — agrupa ícones de diferentes estilos na mesma categoria
- **Ícones de categoria** — ícones representativos antes de cada categoria (seleção semântica inteligente)
- **Seção de favoritos dedicada** — seus favoritos em destaque no topo, sem duplicação

### 🔍 Busca e Filtros
- **Busca instantânea** por nome de arquivo ou caminho
- **Dropdown customizado de categorias** com ícones visuais e navegação por teclado
- **Filtro por categoria** baseado em categorias semânticas (não pastas de estilo)
- **Filtro por estilo** — visualize apenas Outline, Solid, Linear (Border), etc.
- **Ordenação inteligente** — agrupa variantes do mesmo ícone lado a lado
- **Favoritos no topo** — seção dedicada, sem duplicação nas categorias

### 🎨 Personalização
- **Seletor de cor global** — altera a cor de todos os ícones em tempo real
- **Cores adaptativas por tema** — SVGs pretos no tema claro, brancos no tema escuro
- **Tema escuro aprimorado** — paleta cinza neutra (#1d1f24) para melhor visualização
- **Controle de tamanho** com slider (24px - 180px)
- **Preservação de aspect ratio** automática
- **Suporte a viewBox** com correção inteligente

### ⭐ Gerenciamento
- **Sistema de favoritos** com persistência local (localStorage)
- **Copiar SVG** para área de transferência
- **Copiar nome e caminho completo** do arquivo (ex: `Outline › Brands › Adobe.svg`)
- **Contador de ícones** por categoria

### ✏️ Editor Integrado
- **Editor de código** com syntax highlighting para SVG/XML
- **Preview ao vivo** com zoom (10%-5000%), pan e grid
- **5 formatos de exportação**:
  - Preview: Visualização com controles de zoom
  - React: Componente JSX (TypeScript opcional)
  - React Native: Template com react-native-svg
  - PNG: Exportação com escalas 1x-4x
  - Data URI: base64 e encodeURIComponent
- **Otimização SVGO** com 20+ opções configuráveis
- **Ferramentas de transformação**:
  - Rotação (90°/-90°)
  - Espelhamento (Horizontal/Vertical)
  - Editor de dimensões com proporções
- **Detecção inteligente de cores** para aplicação automática de tema
- **Integração com galeria** — botão "Editar" nos cards e modal

### 🔒 Segurança e Privacidade
- **100% processamento local** — seus arquivos nunca saem do navegador
- **Sanitização de SVG** — remove scripts, event handlers e conteúdo externo
- **Sem dependências externas** — zero chamadas a CDNs ou APIs
- **Sem tracking** — total privacidade

---

## 🚀 Como Usar

### Opção 1: Online (Recomendado)
1. Acesse: **[app.svgaze.com](https://app.svgaze.com)**
2. Clique em **"Selecionar pasta"**
3. Escolha a pasta contendo seus arquivos SVG
4. Aproveite! 🎉

### Opção 2: Local (Desenvolvimento)

**Início rápido:** [📖 Guia Completo](docs/QUICK_START.md)

```bash
# 1. Clone o repositório
git clone https://github.com/vindocel/SVGaze.git
cd SVGaze

# 2. Inicie servidor local

# Windows (duplo clique ou terminal):
start-local.bat

# Linux/Mac:
./start-local.sh

# Ou manualmente:
npx serve -l 3000
# python -m http.server 8000
```

**⚠️ Importante:** Não abra `index.html` diretamente (duplo clique). ES6 modules precisam de servidor HTTP. [Veja como testar](docs/HOW_TO_TEST.md)

---

## 📁 Sistema de Categorização Inteligente

O SVGaze detecta automaticamente a estrutura das suas pastas e organiza de forma inteligente, com suporte avançado para:
- ✅ Estilos compostos: "Linear (Border)", "Outline (Filled)"
- ✅ Separadores variados: `"Name - Style"`, `"Name- Style"`, `"Name_Style"`
- ✅ Renderização correta de ícones stroke-only (contorno)

### Estrutura Recomendada

```
icons/
├── Outline/              ← Pasta de ESTILO (ignorada como categoria)
│   ├── Brands/           ← Categoria semântica
│   │   ├── Adobe.svg
│   │   └── Facebook.svg
│   ├── Communication/    ← Categoria semântica
│   │   └── Comment.svg
│   └── Devices/          ← Categoria semântica
│       └── Phone.svg
└── Solid/                ← Pasta de ESTILO (ignorada como categoria)
    ├── Brands/
    │   ├── Adobe.svg
    │   └── Facebook.svg
    └── Communication/
        └── Comment.svg
```

### Resultado no SVGaze

**Filtro de Categorias:**
- ✅ Brands (48 ícones) — unifica Outline + Solid
- ✅ Communication (36 ícones)
- ✅ Devices (32 ícones)

**NÃO aparece:**
- ❌ Outline (é estilo, não categoria)
- ❌ Solid (é estilo, não categoria)

**Badges nos Cards:**
- 🔵 Badge azul "Outline" ou "Solid" em cada card

**[📖 Documentação Completa da Categorização](docs/CATEGORIZATION.md)**

---

## 🛠️ Tecnologias

### Arquitetura Modular
- **26 módulos JavaScript ES6** — organização por responsabilidade
- **12 arquivos CSS** — design system componentizado
- **Zero dependências de runtime** — vanilla JS com CDN apenas para editor (CodeMirror, SVGO, Prism)

### APIs Utilizadas
- **HTML5** — Estrutura semântica e acessível
- **CSS3** — Design system com variáveis CSS e grid layout
- **Vanilla JavaScript (ES6+)** — Modules nativos
- **File System Access API** — `webkitdirectory` para leitura de pastas
- **DOMParser API** — Parse e sanitização de SVGs
- **Clipboard API** — Cópia para área de transferência
- **LocalStorage API** — Persistência de favoritos

---

## 🏗️ Arquitetura

### Módulos JavaScript

```
js/
├── state.js                     # Estado centralizado
├── main.js                      # Orquestrador
└── modules/
    # Galeria
    ├── categoryManager.js       # 🧠 Categorização inteligente
    ├── categoryIconManager.js   # 🎨 Seleção de ícones por categoria
    ├── dropdownManager.js       # 📋 Dropdown customizado com teclado
    ├── utils.js                 # Utilitários
    ├── svgProcessor.js          # Parse e sanitização
    ├── svgColorDetector.js      # 🎨 Detecção monocromático/multicolorido
    ├── fileHandler.js           # Processamento de arquivos
    ├── favoriteManager.js       # Sistema de favoritos
    ├── filterManager.js         # Busca e filtros
    ├── colorManager.js          # Gerenciamento de cores
    ├── sizeManager.js           # Controle de tamanho
    ├── clipboardManager.js      # Copiar/Download
    ├── modalManager.js          # Modal de preview
    ├── galleryRenderer.js       # Renderização do grid
    # Editor
    ├── viewManager.js           # 🔄 Gerenciamento Gallery ↔ Editor
    ├── editorManager.js         # 🎯 Orquestrador do editor
    ├── editorCodeManager.js     # 📝 Editor de código
    ├── editorPreviewManager.js  # 👁️ Preview com zoom/pan
    ├── editorToolsManager.js    # 🔧 Ferramentas principais
    ├── editorExportManager.js   # 📤 Exportação multi-formato
    ├── editorTabManager.js      # 📑 Sistema de abas
    ├── editorTransformManager.js # 🔄 Rotação, flip
    ├── editorDimensionsManager.js # 📐 Editor de dimensões
    ├── editorSvgoManager.js     # ⚡ Integração SVGO
    ├── editorSvgMapper.js       # ⚛️ Mapeamento React/RN
    ├── editorSyntaxHighlighter.js # 🌈 Syntax highlighting
    └── toast.js                 # 🔔 Notificações
```

### Sanitização de SVG

Para garantir segurança, todo SVG passa por sanitização que remove:
- ✅ Tags `<script>`
- ✅ `<foreignObject>` e `<iframe>`
- ✅ Event handlers (`onclick`, `onload`, etc)
- ✅ `href` com `javascript:`
- ✅ Imagens externas (`http://`, `https://`)

---

## 🌐 Compatibilidade de Navegadores

| Navegador | Versão Mínima | Notas |
|-----------|---------------|-------|
| Chrome    | 90+           | ✅ Suporte completo |
| Edge      | 90+           | ✅ Suporte completo |
| Firefox   | 88+           | ⚠️ `webkitdirectory` experimental |
| Safari    | 14+           | ✅ Suporte completo |
| Opera     | 76+           | ✅ Suporte completo |

**Requisitos:**
- Suporte a `webkitdirectory` (seleção de pastas)
- Suporte a ES6 modules
- JavaScript habilitado
- LocalStorage habilitado (para favoritos)

---

## 📚 Documentação

### Guias Disponíveis
- 🚀 **[Início Rápido](docs/QUICK_START.md)** — Como começar em 30 segundos
- 🧪 **[Como Testar Localmente](docs/HOW_TO_TEST.md)** — Guia completo com troubleshooting
- ✏️ **[Editor SVG](docs/EDITOR.md)** — Documentação completa do editor
- 🧠 **[Sistema de Categorização](docs/CATEGORIZATION.md)** — Como funciona a detecção inteligente
- 🔧 **[Troubleshooting](docs/TROUBLESHOOTING.md)** — Solução de problemas comuns
- 🗺️ **[Roadmap](docs/ROADMAP.md)** — Plano de desenvolvimento e próximas features

---

## 🗺️ Roadmap

**[Ver roadmap completo](docs/ROADMAP.md)**

### Status Atual

| Versão | Status | Progresso |
|--------|--------|-----------|
| v1.0 - Visualizador | ✅ Concluído | 100% |
| v1.1 - Melhorias UX | ✅ Concluído | 100% |
| v2.0 - Editor SVG | ✅ Concluído | 100% |
| v3.0 - Avançado | 📋 Planejado | 0% |

### v2.0 - Editor SVG ✅
**Todas as funcionalidades implementadas:**
- ✅ Editor de código com syntax highlighting
- ✅ Preview ao vivo com zoom/pan
- ✅ 5 formatos de exportação (Preview, React, React Native, PNG, Data URI)
- ✅ Modal SVGO com 20+ opções de otimização
- ✅ Ferramentas de transformação (rotação, flip, dimensões)
- ✅ Botão "Editar" nos cards e modal da galeria
- ✅ Detecção inteligente de cores (monocromático vs multicolorido)
- ✅ Sistema de toast para notificações
- ✅ Nova logo polida 400x400
- ✅ Favicons dinâmicos por tema

### v3.0 - Próximas Features
- 🖌️ Edição visual de paths
- 📑 Gerenciamento de camadas
- 🎨 Color picker inline
- 📂 Histórico de arquivos recentes
- 🌍 Internacionalização completa (pt-BR e en-US)

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este é um projeto open-source e estamos abertos a:

- 🐛 **Reportar bugs** — Abra uma [issue](https://github.com/vindocel/SVGaze/issues)
- 💡 **Sugerir features** — Compartilhe suas ideias
- 🔧 **Pull requests** — Correções e melhorias
- 📖 **Melhorias na documentação** — Ajude outros usuários

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código simples e vanilla (sem dependências)
- Siga o estilo de código existente (ES6 modules)
- Use commits semânticos (feat, fix, refactor, docs)
- Teste em múltiplos navegadores
- Documente mudanças significativas
- Adicione documentação em `docs/` se necessário

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**MIT License** significa que você pode:
- ✅ Usar comercialmente
- ✅ Modificar o código
- ✅ Distribuir
- ✅ Uso privado

Apenas mantenha o aviso de copyright e licença.

### ⚠️ Nota sobre a Marca

Embora o código seja open-source sob licença MIT, **"SVGaze"** e **"svgaze.com"** são marcas registradas. Ao fazer fork ou distribuir versões modificadas, recomendamos usar um nome diferente para evitar confusão com o projeto original.

---

## 👤 Autor

**Vindocel**

- GitHub: [@vindocel](https://github.com/vindocel)
- Website: [app.svgaze.com](https://app.svgaze.com)

---

## 🙏 Agradecimentos

- Inspirado pela necessidade de ferramentas simples e privadas para designers
- Comunidade open-source por feedback e sugestões
- Todos os contribuidores do projeto

---

## 📊 Status do Projeto

🟢 **Ativo** — Em desenvolvimento ativo com melhorias contínuas

**Última atualização:** 2025-01-18

---

<div align="center">

**Se este projeto foi útil, considere dar uma ⭐ no repositório!**

Feito com ❤️ por desenvolvedores, para desenvolvedores

[🌐 App](https://app.svgaze.com) • [📖 Docs](docs/) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
