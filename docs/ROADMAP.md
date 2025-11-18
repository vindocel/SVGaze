# 🗺️ SVGaze Roadmap

Este documento descreve o planejamento de desenvolvimento do SVGaze, incluindo recursos implementados, em andamento e planejados para o futuro.

---

## 📊 Status Geral do Projeto

| Versão | Status | Progresso | Data |
|--------|--------|-----------|------|
| v1.0 - Visualizador | ✅ Concluído | 100% | Jan 2025 |
| v1.1 - Melhorias UX | ✅ Concluído | 100% | Jan 2025 |
| v2.0 - Editor SVG | ✅ Concluído | 100% | Jan 2025 |
| v3.0 - Avançado | 📋 Planejado | 0% | TBD |

---

## ✅ v1.0 - Visualizador (Concluído)

### Objetivos
Criar um visualizador local de arquivos SVG com funcionalidades básicas de organização e personalização.

### Recursos Implementados

#### 🎯 Visualização
- [x] Galeria responsiva com CSS Grid
- [x] Preview em tempo real de todos os SVGs
- [x] Modal de visualização ampliada
- [x] Agrupamento automático por pastas
- [x] Badges de subcategorias
- [x] Preservação de aspect ratio
- [x] Suporte a viewBox com correção automática
- [x] Renderização correta de ícones stroke-only (contorno)
- [x] Layout de botões otimizado (ações na mesma linha)

#### 🔍 Busca e Organização
- [x] Sistema de busca por nome de arquivo
- [x] Filtro por categoria baseado em estrutura de pastas
- [x] Filtro por estilo (Outline, Solid, Linear, etc)
- [x] Ordenação inteligente agrupando variantes
- [x] Suporte a estilos compostos ("Linear (Border)")
- [x] Suporte a separadores variados ("Name- Style", "Name - Style")
- [x] Contador de ícones por categoria

#### 🎨 Personalização
- [x] Seletor de cor global com preview em tempo real
- [x] Controle de tamanho via slider (24px - 180px)
- [x] Aplicação de `currentColor` para SVGs
- [x] Interface moderna com design system

#### ⭐ Gerenciamento
- [x] Sistema de favoritos
- [x] Persistência local via localStorage
- [x] Favoritos aparecem no topo da lista
- [x] Botão para limpar todos os favoritos

#### 🔧 Utilidades
- [x] Copiar código SVG para área de transferência
- [x] Copiar nome do arquivo
- [x] Copiar caminho completo
- [x] Download individual de SVG
- [x] Atalhos de teclado (Esc, Ctrl+F)

#### 🔒 Segurança
- [x] Processamento 100% local (sem upload)
- [x] Sanitização de SVG (remove scripts, XSS)
- [x] Sem dependências externas
- [x] Sem tracking ou analytics

#### 🌐 Compatibilidade
- [x] Funciona em navegadores modernos (Chrome, Edge, Firefox, Safari)
- [x] Suporte a `webkitdirectory` para seleção de pastas
- [x] Responsivo para mobile e desktop
- [x] Compatível com GitHub Pages

---

## ✅ v1.1 - Melhorias de Experiência do Usuário (Concluído)

### Objetivos
Melhorar a usabilidade, acessibilidade e experiência geral do usuário.

### Concluído: Janeiro 2025

### Recursos Planejados

#### 🌓 Tema Claro/Escuro
- [x] Sistema de temas com CSS variables
- [x] Toggle de tema no header
- [x] Persistência da preferência do usuário
- [x] Transições suaves entre temas
- [x] Respeito à preferência do sistema (`prefers-color-scheme`)
- [x] Tema escuro com paleta cinza neutra (#1d1f24)
- [x] Cores adaptativas por tema (SVGs pretos/brancos)

**Progresso:** 100% ✅

#### 📦 Exportação e Backup
- [ ] Exportar lista de favoritos como JSON
- [ ] Importar favoritos de arquivo JSON
- [ ] Exportar coleção inteira de SVGs
- [ ] Backup automático de configurações

**Progresso:** 0%

#### 🎨 Visualização Alternativa
- [ ] Toggle entre Grid View e List View
- [ ] Grid compacto (mais ícones por linha)
- [ ] Grid expandido (menos ícones, maiores)
- [ ] Persistir preferência de visualização

**Progresso:** 0%

#### ⌨️ Atalhos de Teclado
- [x] Esc para fechar modal (implementado)
- [x] Ctrl+F para busca (implementado)
- [ ] Setas para navegar entre ícones no modal
- [ ] Enter para abrir modal do item selecionado
- [ ] Ctrl+C para copiar SVG selecionado
- [ ] Tecla F para adicionar/remover favorito
- [ ] Página de ajuda com todos os atalhos

**Progresso:** 30%

#### 🎯 Drag & Drop
- [ ] Arrastar e soltar pasta de SVGs
- [ ] Arrastar e soltar arquivos SVG individuais
- [ ] Feedback visual durante o arrasto
- [ ] Suporte a múltiplas pastas

**Progresso:** 0%

#### 🌍 Internacionalização (i18n)
- [x] Sistema de traduções implementado
- [x] Idioma Português (pt-BR) completo
- [ ] Idioma Inglês (en-US)
- [ ] Seletor de idioma no header
- [ ] Detecção automática do idioma do navegador
- [ ] Persistência da escolha de idioma

**Progresso:** 60% (Estrutura pronta, falta inglês)

#### ♿ Acessibilidade
- [ ] Suporte completo a leitores de tela
- [ ] Navegação por teclado aprimorada
- [ ] Indicadores de foco visíveis
- [ ] Contraste adequado em todos os temas
- [ ] Labels ARIA completos
- [ ] Testes com ferramentas de acessibilidade

**Progresso:** 20%

#### 📊 Estatísticas e Informações
- [ ] Painel de estatísticas (total de SVGs, categorias, etc)
- [ ] Exibir tamanho dos arquivos SVG
- [ ] Mostrar dimensões originais do SVG
- [ ] Tempo de carregamento
- [ ] Gráfico de distribuição por categoria

**Progresso:** 0%

---

## ✅ v2.0 - Editor SVG (Concluído)

### Objetivos
Adicionar um editor completo de SVG com código, preview ao vivo, transformações e exportação multi-formato.

### Concluído: Janeiro 2025

### Recursos Implementados

#### 📝 Editor de Código
- [x] Syntax highlighting customizado para SVG/XML
- [x] Preview ao vivo sincronizado com código
- [x] Indicador de tamanho do arquivo em tempo real
- [x] Botão de upload para carregar SVG
- [x] Copiar código para clipboard

#### 👁️ Preview ao Vivo
- [x] Zoom de 10% a 5000%
- [x] Pan (arrastar com Ctrl+mouse)
- [x] Zoom com roda do mouse (Ctrl+scroll)
- [x] Botões de zoom in/out
- [x] Fit to view
- [x] Toggle de grid
- [x] Toggle de fundo checkered
- [x] Exibição de dimensões do SVG

#### 📤 Sistema de Exportação (5 formatos)
- [x] **Preview** - Visualização com controles de zoom
- [x] **React** - Componente JSX (TypeScript opcional, aspas simples)
- [x] **React Native** - Template com react-native-svg
- [x] **PNG** - Exportação com escalas 1x, 2x, 3x, 4x
- [x] **Data URI** - base64 e encodeURIComponent

#### ⚡ Otimização SVGO
- [x] Modal de configuração com 20+ opções
- [x] Preview de antes/depois
- [x] Exibição de redução de tamanho (%)
- [x] Plugins configuráveis individualmente
- [x] Resetar configurações para padrão

#### 🔄 Ferramentas de Transformação
- [x] Rotação 90° horário
- [x] Rotação 90° anti-horário
- [x] Espelhamento Horizontal
- [x] Espelhamento Vertical
- [x] Editor de dimensões com bloqueio proporcional

#### 🎨 Detecção Inteligente de Cores
- [x] Detecta se SVG é monocromático ou multicolorido
- [x] Aplica tema automaticamente em SVGs monocromáticos
- [x] Preserva cores originais em SVGs multicoloridos
- [x] Resolve cores CSS de `<style>` tags e classes

#### 🔗 Integração com Galeria
- [x] Botão "Editar" nos cards da galeria
- [x] Botão "Editar" no modal de preview
- [x] `openInEditor(svgCode, fileName)` para abrir SVG no editor
- [x] Switch de views Gallery ↔ Editor

#### 🔔 Sistema de Notificações
- [x] Toast para feedback de ações
- [x] Estados de sucesso/erro
- [x] Auto-dismiss

#### 🆕 Branding Atualizado
- [x] Nova logo polida 400x400 viewBox
- [x] Favicons dinâmicos (dark/light)
- [x] Logo interativa (clique abre logo no editor)

---

## 📋 v3.0 - Funcionalidades Avançadas (Planejado)

### Objetivos
Adicionar edição visual avançada e funcionalidades de produtividade.

### Data Estimada: TBD

### Recursos Planejados

#### ✏️ Edição Visual de Paths
- [ ] Visualização de pontos de controle
- [ ] Mover pontos de paths
- [ ] Adicionar/remover pontos
- [ ] Simplificar paths automaticamente
- [ ] Suavizar curvas

#### 🎨 Color Picker Inline
- [ ] Selecionar cores diretamente no preview
- [ ] Alterar cor de elementos individuais
- [ ] Paleta de cores sugeridas
- [ ] Histórico de cores usadas

#### 🌍 Internacionalização Completa
- [ ] Idioma Inglês (en-US)
- [ ] Seletor de idioma no header
- [ ] Detecção automática do idioma do navegador

---

## 🏗️ Arquitetura e Refatoração Técnica

### Em Progresso (Paralelo à v1.1)

#### 📦 Modularização
- [x] Separar CSS em arquivos de componentes
- [x] Criar sistema de módulos ES6 para JavaScript
- [x] Estrutura de diretórios organizada
- [x] Sistema de estado centralizado
- [ ] Lazy loading de módulos não críticos
- [ ] Service Worker para cache offline

#### 🧪 Testes
- [ ] Configurar ambiente de testes
- [ ] Testes unitários para funções críticas
- [ ] Testes de integração
- [ ] Testes E2E básicos
- [ ] Testes de acessibilidade automatizados

#### 📝 Documentação
- [x] README.md completo
- [x] ROADMAP.md detalhado
- [ ] Documentação técnica da API
- [ ] Guia de contribuição expandido
- [ ] Wiki no GitHub
- [ ] Tutoriais em vídeo

#### 🚀 Performance
- [ ] Virtualização da lista para grandes coleções
- [ ] Web Workers para processamento pesado
- [ ] IndexedDB para cache de SVGs grandes
- [ ] Otimização de renderização
- [ ] Profiling e benchmarks

---

## 🎯 Metas de Longo Prazo

### 2025
- ✅ Lançar v1.0 como visualizador funcional
- 🎯 Atingir 100 estrelas no GitHub
- 🎯 Comunidade ativa de contribuidores
- 🎯 Suporte a 2+ idiomas
- 🎯 Editor básico funcional (v2.0)

---

## 🤝 Como Contribuir com o Roadmap

Sua opinião é importante! Se você tem sugestões de recursos:

1. **Abra uma Issue** no GitHub com a tag `feature-request`
2. **Vote em features** existentes com 👍 nas issues
3. **Junte-se à discussão** em issues abertas
4. **Contribua com código** para recursos planejados

### Priorização

As features são priorizadas com base em:
1. **Impacto no usuário** - Quantos usuários se beneficiam?
2. **Complexidade técnica** - Quanto esforço é necessário?
3. **Alinhamento com visão** - Faz sentido para o projeto?
4. **Feedback da comunidade** - Quantos usuários pediram?

---

## 📞 Feedback

Tem sugestões para o roadmap? Entre em contato:

- **GitHub Issues:** [github.com/vindocel/SVGaze/issues](https://github.com/vindocel/SVGaze/issues)
- **Discussions:** [github.com/vindocel/SVGaze/discussions](https://github.com/vindocel/SVGaze/discussions)

---

<div align="center">

**Última atualização:** 2025-01-18

⭐ **Star o projeto no GitHub para acompanhar o progresso!**

[🌐 App](https://app.svgaze.com) • [📖 README](README.md) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
