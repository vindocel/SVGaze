# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Adicionado - Melhorias de UX e Interface
- **Novo design de cards modernizado**:
  - Preview com aspect-ratio 1:1 e background temático
  - Botão de favorito posicionado no canto superior direito da preview
  - Filename centralizado abaixo da preview
  - Badges de estilo e subcategoria centralizadas
  - Botão "Abrir" como ação primária ocupando toda largura
  - Botões "Editar" e "Copiar" como links secundários no rodapé
- **Ícones nos botões do header**:
  - Botão "Galeria" com ícone de galeria (imagem)
  - Botão "Editor" com ícone de workflow/git
  - Botão "Selecionar pasta" com ícone de pasta
  - Desktop: ícone + texto visíveis
  - Mobile: apenas ícone visível (exceto "Selecionar pasta" que mantém ambos)
- **Melhorias no comportamento do logo**:
  - Clicar no logo no modo galeria reseta filtros para "Todas as categorias"
  - Scroll suave para o topo da página ao clicar no logo
  - Atualização correta do estado do dropdown de categorias
- **Otimização de espaço no header mobile**:
  - Elementos reduzidos em escala (logo 24px, botões menores, switch compacto)
  - Elimina necessidade de scroll horizontal
  - Botão de menu mobile movido para o header primário
  - Layout mais harmonioso e compacto

### Adicionado - Nova View de Editor SVG
- **Sistema de visualização dual** (Galeria ↔ Editor) com gerenciador de views
- **Editor de código** com syntax highlighting customizado para SVG/XML
- **Preview ao vivo** com controles de zoom (10%-5000%), pan e alternância de grid/checkered
- **Sistema de 5 abas de exportação**:
  - Preview: Visualização do SVG com controles de zoom
  - React: Conversão para componente JSX com opções (TypeScript, aspas simples)
  - React Native: Template de componente com react-native-svg
  - PNG: Exportação de imagem com seletor de escala (1x-4x)
  - Data URI: Geração de URI base64 e encodeURIComponent
- **Modal SVGO** com 20+ opções de otimização configuráveis
- **Ferramentas de transformação**:
  - Rotação (90° horário e anti-horário)
  - Espelhamento (Horizontal e Vertical)
  - Editor de dimensões com bloqueio proporcional
- **Botão "Editar"** nos cards e modal da galeria para abrir SVG no editor
- **Detecção inteligente de cores** (monocromático vs multicolorido) para aplicação automática de tema
- **Resolução de cores CSS** para SVGs com `<style>` tags e classes (ex: `.fil1 {fill:black}`)
- **Sistema de toast** para notificações de ações do usuário
- **14 novos módulos JavaScript** do editor:
  - `viewManager.js` - Gerenciamento de views
  - `editorManager.js` - Orquestrador principal
  - `editorCodeManager.js` - Editor de código
  - `editorPreviewManager.js` - Preview com zoom/pan
  - `editorToolsManager.js` - Ferramentas principais
  - `editorExportManager.js` - Exportação multi-formato
  - `editorTabManager.js` - Sistema de abas
  - `editorTransformManager.js` - Transformações
  - `editorDimensionsManager.js` - Editor de dimensões
  - `editorSvgoManager.js` - Integração SVGO
  - `editorSvgMapper.js` - Mapeamento SVG para React/RN
  - `editorSyntaxHighlighter.js` - Syntax highlighting
  - `svgColorDetector.js` - Detecção de cores
  - `toast.js` - Notificações
- **3 novos arquivos CSS**: `editor.css`, `svgo-modal.css`, `toast.css`

### Adicionado - Branding Atualizado
- Nova logo polida com viewBox 400x400
- Favicons dinâmicos (dark/light) que adaptam ao tema do sistema
- Logo interativa (clique navega para galeria ou abre no editor)
- Tradução "Carregar SVG" para botão de upload no editor

### Adicionado - Melhorias na Galeria
- Seção de favoritos dedicada no topo da galeria com destaque visual
- Ícones de categoria nos cabeçalhos da galeria
- Ícones de categoria no menu de filtro de categorias
- Sistema de seleção inteligente de ícones por categoria com correspondência semântica
- Componente dropdown customizado substituindo `<select>` nativo
- Suporte visual a ícones no dropdown de categorias
- Navegação por teclado completa no dropdown (setas, Enter, Escape, Tab)
- Gerenciador de ícones de categoria (`categoryIconManager.js`)
- Gerenciador de dropdown customizado (`dropdownManager.js`)
- Estilos CSS para componente dropdown (`dropdown.css`)
- Consistência de estilo para todos os ícones de categoria (usa o estilo mais comum)
- Adaptação automática de cores dos ícones ao tema (claro/escuro)

### Alterado
- Arquitetura expandida para **26 módulos JavaScript ES6** (era 15)
- **12 componentes CSS** modulares (era 8)
- Favoritos agora aparecem apenas na seção "⭐ Favoritos", não mais duplicados nas categorias originais
- Menu de categorias usa dropdown customizado em vez de `<select>` padrão
- Ícones de categoria agora usam correspondência semântica inteligente em vez de seleção aleatória
- Zoom do preview exibe valores inteiros (ex: "106%" em vez de "106.1520150601%")
- Preview PNG renderiza em tamanho limitado (máx 400px) para melhor visualização

### Corrigido
- Problema de texto cortado no botão do dropdown
- Ícones aparecendo pretos no tema escuro (agora adaptam corretamente)
- Menu dropdown sendo cortado dentro da toolbar (overflow context)
- Duplicação de favoritos na galeria
- Conflito de padding no botão do dropdown
- SVGs com `fill="none"` no elemento raiz agora recebem coloração correta
- SVGs com elementos dentro de `<g>` (grupos) agora são processados corretamente
- Scroll horizontal desnecessário no header mobile
- Comportamento incorreto ao clicar no logo (não resetava para "Todas as categorias")

## [1.1.0] - 2025-01-07

### Adicionado
- Arquitetura 100% modular (13 módulos JS + 7 CSS)
- Sistema de categorização inteligente
- Detecção automática de estilos (Outline, Solid, Linear, etc)
- Suporte a estilos compostos ("Linear (Border)")
- Suporte a separadores variados ("Name- Style", "Name - Style")
- Badges de estilo nos cards
- Unificação de categorias duplicadas
- Layout de botões otimizado (★ Abrir Copiar)
- Copiar caminho completo com nome do arquivo
- Tema claro/escuro com toggle animado
- Cores adaptativas por tema (SVGs pretos/brancos)
- Tema escuro com paleta cinza neutra (#1d1f24)
- Renderização correta de ícones stroke-only
- Ordenação inteligente agrupando variantes

### Alterado
- Reorganização completa da arquitetura em módulos ES6
- Sistema de categorização migrado de pastas para detecção semântica
- Interface redesenhada com design system moderno

## [1.0.0] - 2024-12-15

### Adicionado
- Visualizador de ícones SVG com galeria responsiva
- Preview em tempo real de todos os SVGs
- Modal de visualização ampliada
- Busca instantânea por nome de arquivo
- Filtro por categoria
- Seletor de cor global
- Controle de tamanho com slider (24px - 180px)
- Sistema de favoritos com localStorage
- Copiar SVG para área de transferência
- Sanitização de SVG (remove scripts e conteúdo perigoso)
- Suporte a viewBox com correção inteligente
- Processamento 100% local (sem upload)

[Não Lançado]: https://github.com/vindocel/SVGaze/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/vindocel/SVGaze/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vindocel/SVGaze/releases/tag/v1.0.0
