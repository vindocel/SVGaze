# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Adicionado
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
- Favoritos agora aparecem apenas na seção "⭐ Favoritos", não mais duplicados nas categorias originais
- Menu de categorias usa dropdown customizado em vez de `<select>` padrão
- Ícones de categoria agora usam correspondência semântica inteligente em vez de seleção aleatória
- Melhorada visualização do dropdown para não ser cortado pela toolbar

### Corrigido
- Problema de texto cortado no botão do dropdown
- Ícones aparecendo pretos no tema escuro (agora adaptam corretamente)
- Menu dropdown sendo cortado dentro da toolbar (overflow context)
- Duplicação de favoritos na galeria
- Conflito de padding no botão do dropdown

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
