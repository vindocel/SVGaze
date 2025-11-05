# SVGaze 🔍

> Visualizador moderno de ícones SVG — totalmente local, sem upload, 100% privacidade

**SVGaze** é uma aplicação web open-source que permite visualizar, organizar e gerenciar arquivos SVG locais diretamente no navegador, sem necessidade de upload ou backend. Ideal para designers e desenvolvedores que trabalham com coleções de ícones, ilustrações ou vetores em formato SVG.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://app.svgaze.com)

---

## ✨ Recursos Principais

### 🎯 Visualização Inteligente
- **Galeria responsiva** com grid adaptativo
- **Preview em tempo real** de todos os SVGs da pasta
- **Modal de visualização ampliada** para análise detalhada
- **Agrupamento automático** por pastas e subcategorias
- **Badges de subcategorias** para navegação visual

### 🔍 Busca e Filtros
- **Busca instantânea** por nome de arquivo ou caminho
- **Filtro por categoria** baseado na estrutura de pastas
- **Ordenação inteligente** com favoritos no topo

### 🎨 Personalização
- **Seletor de cor global** — altera a cor de todos os ícones em tempo real
- **Controle de tamanho** com slider (24px - 180px)
- **Preservação de aspect ratio** automática
- **Suporte a viewBox** com correção inteligente

### ⭐ Gerenciamento
- **Sistema de favoritos** com persistência local (localStorage)
- **Copiar SVG** para área de transferência
- **Copiar nome e caminho** do arquivo
- **Download individual** de cada SVG
- **Contador de ícones** por categoria

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

### Opção 2: Local (Offline)
1. Clone o repositório:
   ```bash
   git clone https://github.com/vindocel/SVGaze.git
   ```
2. Abra `index.html` no navegador
3. Clique em **"Selecionar pasta"**
4. Selecione a pasta com seus SVGs

### 📁 Estrutura de Pastas Recomendada

Para melhor organização, recomendamos a seguinte estrutura:

```
Icons/
├── arrow/
│   ├── Fill/
│   │   ├── arrow-left.svg
│   │   └── arrow-right.svg
│   └── Outline/
│       └── arrow-up.svg
├── social/
│   ├── facebook.svg
│   └── twitter.svg
└── ui/
    └── close.svg
```

O SVGaze automaticamente:
- Usa a **primeira pasta** como categoria principal (`arrow`, `social`, `ui`)
- Usa as **subpastas** como badges de subcategoria (`Fill`, `Outline`)
- Agrupa e organiza visualmente na interface

---

## 🛠️ Tecnologias

Este projeto foi construído com tecnologias web modernas e vanilla (zero dependências):

- **HTML5** — Estrutura semântica e acessível
- **CSS3** — Design system com variáveis CSS e grid layout
- **Vanilla JavaScript (ES6+)** — Sem frameworks, apenas JS puro
- **File System Access API** — `webkitdirectory` para leitura de pastas
- **DOMParser API** — Parse e sanitização de SVGs
- **Clipboard API** — Cópia para área de transferência
- **LocalStorage API** — Persistência de favoritos

---

## 🏗️ Arquitetura e Funcionamento

### Fluxo Principal

```
1. Usuário seleciona pasta → webkitdirectory
2. FileReader lê arquivos .svg → Promises
3. Parse com DOMParser → Sanitização
4. Análise de estrutura de pastas → Categorização
5. Renderização no DOM → Grid responsivo
6. Aplicação de cores/tamanhos → CSS + currentColor
```

### Principais Funções

| Função | Responsabilidade |
|--------|------------------|
| `handleFiles()` | Processa arquivos selecionados |
| `parseAndSanitizeSVG()` | Sanitiza SVGs removendo scripts/XSS |
| `ensureViewBox()` | Garante viewBox correto com fallbacks |
| `applyCurrentColorToSVG()` | Aplica currentColor para permitir personalização |
| `filteredItems()` | Aplica busca, filtros e ordenação |
| `renderGrid()` | Renderiza galeria com categorias |

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
- JavaScript habilitado
- LocalStorage habilitado (para favoritos)

---

## 🗺️ Roadmap

### Versão Atual: v1.0 - Visualizador
- ✅ Visualização local de SVGs
- ✅ Sistema de busca e filtros
- ✅ Personalização de cor e tamanho
- ✅ Favoritos persistentes
- ✅ Agrupamento por categorias

### Próximas Versões

#### v1.1 - Melhorias UX
- [ ] Modo escuro / claro
- [ ] Exportação de favoritos
- [ ] Grid/List view toggle
- [ ] Atalhos de teclado
- [ ] Arrastar e soltar arquivos

#### v2.0 - Editor Básico (Planejado)
- [ ] Edição de paths
- [ ] Manipulação de cores por camada
- [ ] Gerenciamento de camadas
- [ ] Exportação otimizada (SVGO)
- [ ] Conversão para PNG/JPG

#### v3.0 - Recursos Avançados (Futuro)
- [ ] Gerador de sprite sheets
- [ ] Otimizador de SVG em lote
- [ ] Comparação lado a lado
- [ ] Histórico de edições

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
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código simples e vanilla (sem dependências)
- Siga o estilo de código existente
- Teste em múltiplos navegadores
- Documente mudanças significativas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**MIT License** significa que você pode:
- ✅ Usar comercialmente
- ✅ Modificar o código
- ✅ Distribuir
- ✅ Uso privado

Apenas mantenha o aviso de copyright e licença.

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

**Última atualização:** 2025-01-05

---

<div align="center">

**Se este projeto foi útil, considere dar uma ⭐ no repositório!**

Feito com ❤️ por desenvolvedores, para desenvolvedores

[🌐 App](https://app.svgaze.com) • [📖 Docs](https://github.com/vindocel/SVGaze/wiki) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
