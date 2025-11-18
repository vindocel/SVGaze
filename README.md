# SVGaze 🔍

> Visualizador e editor moderno de ícones SVG — totalmente local, sem upload, 100% privacidade

**SVGaze** é uma aplicação web open-source que permite visualizar, organizar, editar e exportar arquivos SVG locais diretamente no navegador, sem necessidade de upload ou backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://app.svgaze.com)

---

## ✨ Recursos Principais

### 🎯 Galeria de SVGs
- Galeria responsiva com grid adaptativo e preview em tempo real
- Categorização inteligente — detecta categorias semânticas vs estilos
- Busca instantânea e filtros por categoria/estilo
- Sistema de favoritos com persistência local
- Badges de estilo (Outline, Solid) nos cards

### ✏️ Editor SVG Integrado
- Editor de código com syntax highlighting
- Preview ao vivo com zoom (10%-5000%), pan e grid
- 5 formatos de exportação: Preview, React, React Native, PNG, Data URI
- Otimização SVGO com 20+ opções configuráveis
- Ferramentas de transformação (rotação, flip, dimensões)

**[📖 Documentação completa do Editor](docs/EDITOR.md)**

### 🎨 Personalização
- Seletor de cor global com cores adaptativas por tema
- Tema claro/escuro com transição suave
- Controle de tamanho (24px - 180px)

### 🔒 Segurança
- 100% processamento local — seus arquivos nunca saem do navegador
- Sanitização de SVG — remove scripts e conteúdo malicioso
- Sem tracking — total privacidade

---

## 🚀 Como Usar

### Online (Recomendado)
1. Acesse: **[app.svgaze.com](https://app.svgaze.com)**
2. Clique em **"Selecionar pasta"**
3. Escolha a pasta com seus SVGs
4. Aproveite! 🎉

### Local

```bash
git clone https://github.com/vindocel/SVGaze.git
cd SVGaze

# Windows:
start-local.bat

# Linux/Mac:
./start-local.sh
```

**[📖 Guia completo de instalação](docs/QUICK_START.md)** | **[🧪 Como testar](docs/HOW_TO_TEST.md)**

---

## 📁 Categorização Inteligente

O SVGaze detecta automaticamente a estrutura das suas pastas:

```
icons/
├── Outline/           ← Estilo (ignorado como categoria)
│   ├── Brands/        ← Categoria semântica
│   └── Devices/
└── Solid/             ← Estilo
    ├── Brands/
    └── Devices/
```

**Resultado:** Filtro mostra "Brands" e "Devices" (não "Outline"/"Solid"), com badges de estilo nos cards.

**[📖 Documentação completa da Categorização](docs/CATEGORIZATION.md)**

---

## 🛠️ Tecnologias

- **26 módulos JavaScript ES6** — arquitetura modular
- **12 arquivos CSS** — design system componentizado
- **Zero dependências de runtime** — vanilla JS
- **APIs nativas:** File System Access, DOMParser, Clipboard, LocalStorage

---

## 📚 Documentação

| Guia | Descrição |
|------|-----------|
| 🚀 **[Início Rápido](docs/QUICK_START.md)** | Como começar em 30 segundos |
| 🧪 **[Como Testar](docs/HOW_TO_TEST.md)** | Guia completo com troubleshooting |
| ✏️ **[Editor SVG](docs/EDITOR.md)** | Documentação completa do editor |
| 🧠 **[Categorização](docs/CATEGORIZATION.md)** | Sistema de detecção inteligente |
| 🔧 **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Solução de problemas |
| 🗺️ **[Roadmap](docs/ROADMAP.md)** | Plano de desenvolvimento |

---

## 🗺️ Roadmap

| Versão | Status |
|--------|--------|
| v1.0 - Visualizador | ✅ Concluído |
| v1.1 - Melhorias UX | ✅ Concluído |
| v2.0 - Editor SVG | ✅ Concluído |
| v3.0 - Avançado | 📋 Planejado |

**[📖 Ver roadmap completo](docs/ROADMAP.md)**

---

## 🌐 Compatibilidade

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 90+ | ✅ |
| Edge | 90+ | ✅ |
| Firefox | 88+ | ⚠️ Experimental |
| Safari | 14+ | ✅ |

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

- 🐛 **[Reportar bugs](https://github.com/vindocel/SVGaze/issues)**
- 💡 **Sugerir features**
- 🔧 **Pull requests**

### Diretrizes
- Código vanilla (sem dependências)
- ES6 modules
- Commits semânticos

---

## 📄 Licença

**MIT License** — use comercialmente, modifique, distribua livremente.

⚠️ **"SVGaze"** e **"svgaze.com"** são marcas registradas.

---

## 👤 Autor

**Vindocel** — [@vindocel](https://github.com/vindocel) | [app.svgaze.com](https://app.svgaze.com)

---

<div align="center">

**Se este projeto foi útil, considere dar uma ⭐ no repositório!**

[🌐 App](https://app.svgaze.com) • [📖 Docs](docs/) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
