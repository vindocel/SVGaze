# 🗺️ SVGaze Roadmap

Este documento descreve o planejamento de desenvolvimento do SVGaze, incluindo recursos implementados, em andamento e planejados para o futuro.

---

## 📊 Status Geral do Projeto

| Versão | Status | Progresso | Data Estimada |
|--------|--------|-----------|---------------|
| v1.0 - Visualizador | ✅ Concluído | 100% | Jan 2025 |
| v1.1 - Melhorias UX | 🚧 Em Progresso | 40% | Fev 2025 |
| v2.0 - Editor Básico | 📋 Planejado | 0% | Jun 2025 |
| v3.0 - Recursos Avançados | 💭 Futuro | 0% | 2026 |

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

#### 🔍 Busca e Organização
- [x] Sistema de busca por nome de arquivo
- [x] Filtro por categoria baseado em estrutura de pastas
- [x] Ordenação alfabética
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

## 🚧 v1.1 - Melhorias de Experiência do Usuário (Em Progresso)

### Objetivos
Melhorar a usabilidade, acessibilidade e experiência geral do usuário.

### Data Estimada: Fevereiro 2025

### Recursos Planejados

#### 🌓 Tema Claro/Escuro
- [x] Sistema de temas com CSS variables
- [ ] Toggle de tema no header
- [ ] Persistência da preferência do usuário
- [ ] Transições suaves entre temas
- [ ] Respeito à preferência do sistema (`prefers-color-scheme`)

**Progresso:** 40% (Estrutura preparada)

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

## 📋 v2.0 - Editor Básico de SVG (Planejado)

### Objetivos
Adicionar capacidades básicas de edição de SVG sem necessidade de ferramentas externas.

### Data Estimada: Junho 2025

### Recursos Planejados

#### ✏️ Edição de Paths
- [ ] Visualização de pontos de controle
- [ ] Mover pontos de paths
- [ ] Adicionar/remover pontos
- [ ] Simplificar paths automaticamente
- [ ] Suavizar curvas

#### 🎨 Manipulação de Cores por Camada
- [ ] Identificar todas as cores no SVG
- [ ] Alterar cor de elementos individuais
- [ ] Pré-visualização de mudanças
- [ ] Desfazer/refazer alterações
- [ ] Paleta de cores sugeridas

#### 📑 Gerenciamento de Camadas
- [ ] Lista de camadas/elementos do SVG
- [ ] Mostrar/ocultar camadas
- [ ] Renomear camadas
- [ ] Reordenar camadas (z-index)
- [ ] Agrupar/desagrupar elementos
- [ ] Bloquear camadas

#### 📐 Transformações
- [ ] Redimensionar elementos
- [ ] Rotacionar elementos
- [ ] Espelhar (horizontal/vertical)
- [ ] Alinhar elementos
- [ ] Distribuir elementos uniformemente

#### 💾 Exportação Otimizada
- [ ] Integração com SVGO para otimização
- [ ] Ajustes de precisão de números
- [ ] Remover metadados desnecessários
- [ ] Minificar SVG
- [ ] Comparação antes/depois da otimização

#### 🔄 Conversão de Formatos
- [ ] Exportar como PNG (diferentes resoluções)
- [ ] Exportar como JPG
- [ ] Exportar como WebP
- [ ] Batch conversion (converter múltiplos de uma vez)
- [ ] Configurações de qualidade e compressão

#### 📜 Histórico de Edições
- [ ] Desfazer ilimitado
- [ ] Refazer
- [ ] Timeline de modificações
- [ ] Salvar versões do SVG
- [ ] Comparar versões

---

## 💭 v3.0 - Recursos Avançados (Futuro)

### Objetivos
Transformar o SVGaze em uma ferramenta profissional completa para gerenciamento de ícones e SVGs.

### Data Estimada: 2026

### Recursos em Consideração

#### 🎨 Gerador de Sprite Sheets
- [ ] Combinar múltiplos SVGs em um único arquivo
- [ ] Gerar sprite sheets otimizados
- [ ] Exportar CSS/JSON com coordenadas
- [ ] Preview do sprite sheet
- [ ] Configurações de espaçamento e layout

#### ⚡ Otimizador de SVG em Lote
- [ ] Processar múltiplos SVGs de uma vez
- [ ] Aplicar regras de otimização personalizadas
- [ ] Relatório de economia de bytes
- [ ] Configurações por categoria
- [ ] Backup automático antes de otimizar

#### 🔍 Comparação Lado a Lado
- [ ] Comparar dois SVGs visualmente
- [ ] Diff de código SVG
- [ ] Comparar antes/depois de otimização
- [ ] Comparar versões diferentes
- [ ] Overlay para detectar diferenças

#### 📚 Biblioteca de Componentes
- [ ] Criar biblioteca de símbolos reutilizáveis
- [ ] Tags e categorização avançada
- [ ] Pesquisa semântica
- [ ] Sincronização em nuvem (opcional)

#### 🤖 Automação e Scripts
- [ ] API JavaScript para automações
- [ ] Criar ações personalizadas
- [ ] Macros para tarefas repetitivas
- [ ] Integração com ferramentas de design

#### 🔌 Plugins e Extensões
- [ ] Sistema de plugins
- [ ] Marketplace de extensões
- [ ] SDK para desenvolvedores
- [ ] Temas personalizados da comunidade

#### 🌐 Colaboração
- [ ] Compartilhar coleções via link
- [ ] Comentários em SVGs
- [ ] Histórico de atividades
- [ ] Permissões de acesso

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
- 🎯 Suporte a 3+ idiomas
- 🎯 Editor básico funcional (v2.0)

### 2026
- 🎯 SVGaze como ferramenta de referência para SVGs
- 🎯 1000+ estrelas no GitHub
- 🎯 Sistema de plugins maduro
- 🎯 Versão desktop (Electron/Tauri)
- 🎯 Parcerias com bibliotecas de ícones

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

**Última atualização:** 2025-01-05

⭐ **Star o projeto no GitHub para acompanhar o progresso!**

[🌐 App](https://app.svgaze.com) • [📖 README](README.md) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
