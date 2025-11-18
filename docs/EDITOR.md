# SVGaze Editor - Documentação Completa

## Visão Geral

O **SVGaze Editor** é um editor de código SVG completo integrado ao SVGaze. Ele permite editar, visualizar, transformar, otimizar e exportar arquivos SVG em múltiplos formatos, tudo em tempo real.

---

## Características Principais

### 🎨 Interface Split-Pane
- **Editor de Código** (esquerda): Editor com syntax highlighting customizado para SVG/XML
- **Preview ao Vivo** (direita): Visualização em tempo real com controles avançados
- **Divisor Redimensionável**: Ajuste o tamanho dos painéis conforme necessário

---

## ✍️ Editor de Código

### Syntax Highlighting
- Highlighting customizado para tags, atributos, valores e comentários SVG/XML
- Cores adaptativas por tema (claro/escuro)
- Suporte completo a sintaxe SVG

### Funcionalidades
- Suporte a Tab para indentação (2 espaços)
- Word wrap configurável
- Auto-atualização do preview (debounced 300ms)
- Exibição do tamanho do arquivo em tempo real
- Botão de upload para carregar SVG do sistema
- Copiar código para clipboard

---

## 👁️ Preview ao Vivo

### Controles de Zoom
- **Range**: 10% a 5000%
- **Botões +/-**: Zoom incremental
- **Ctrl + Scroll**: Zoom contínuo com roda do mouse
- **Fit to View**: Ajusta automaticamente ao tamanho da área
- **Valores inteiros**: Exibe "106%" em vez de "106.1520150601%"

### Pan/Navegação
- **Ctrl + Click + Arraste**: Move o preview na área de visualização
- Navegação suave e responsiva

### Opções de Visualização
- **Toggle Grid**: Grade de referência para alinhamento
- **Toggle Checkered**: Fundo xadrez para ver transparência
- **Informações**: Exibe dimensões (largura × altura) do SVG

### Detecção de Erros
- Mostra mensagens de erro para SVG inválido
- Feedback visual imediato

---

## 🔄 Ferramentas de Transformação

### Rotação
- **Rotação 90° horário**: Gira o SVG para a direita
- **Rotação 90° anti-horário**: Gira o SVG para a esquerda

### Espelhamento
- **Flip Horizontal**: Espelha horizontalmente
- **Flip Vertical**: Espelha verticalmente

### Editor de Dimensões
- Alterar largura e altura do SVG
- **Bloqueio proporcional**: Mantém aspect ratio ao alterar dimensões
- Aplicar novas dimensões ao SVG

---

## ⚡ Otimização SVGO

### Modal de Configuração
- **20+ opções de otimização** configuráveis individualmente
- Preview de antes/depois em tempo real
- Exibição de redução de tamanho em porcentagem
- Botão para resetar configurações para padrão

### Plugins Disponíveis
- Remove comentários
- Remove XML declarations
- Remove DOCTYPE
- Remove whitespace desnecessário
- Arredonda números decimais
- Remove atributos com valores padrão
- Limpa IDs não utilizados
- Mescla paths
- Remove elementos vazios
- E muito mais...

### Comparação de Tamanho
```
578 bytes → 493 bytes (-15%)
```

---

## 📤 Sistema de Exportação (5 Abas)

### 1. Preview
- Visualização do SVG com todos os controles de zoom
- Mesmas funcionalidades do preview principal
- Ideal para inspeção detalhada

### 2. React (JSX)
- Converte SVG para componente React funcional
- **Opções configuráveis**:
  - TypeScript (adiciona tipos)
  - Aspas simples (style guide)
- Transforma atributos HTML para props React:
  - `class` → `className`
  - `stroke-width` → `strokeWidth`
  - `fill-opacity` → `fillOpacity`
  - etc.
- Copia código completo do componente
- Pronto para usar em projetos React

### 3. React Native
- Template para react-native-svg
- Instruções de instalação do pacote
- Estrutura do componente pronta
- Código SVG incluído como referência

### 4. PNG
- Exportação de imagem PNG
- **Escalas disponíveis**: 1x, 2x, 3x, 4x
- Preview com tamanho máximo de 400px
- Download preserva escala selecionada
- Ideal para assets em diferentes densidades

### 5. Data URI
- Codifica SVG como Data URI
- **Dois formatos**:
  - base64: `data:image/svg+xml;base64,...`
  - encodeURIComponent: `data:image/svg+xml,...`
- Pode ser usado em CSS, HTML ou JavaScript
- Copia diretamente para clipboard

---

## 🎨 Detecção Inteligente de Cores

### Funcionamento
- Detecta automaticamente se SVG é monocromático ou multicolorido
- Analisa todos os atributos `fill` e `stroke`
- Resolve cores de CSS classes (`<style>` tags)

### Aplicação de Tema
- **SVGs monocromáticos**: Aplica cor do tema (preto no claro, branco no escuro)
- **SVGs multicoloridos**: Preserva cores originais
- Transição suave entre temas

### Resolução de CSS
Para SVGs com classes CSS como:
```xml
<style>.fil1 {fill:black}</style>
<path class="fil1" d="..."/>
```
O sistema converte para atributos inline antes da detecção de cores.

---

## 🔗 Integração com Galeria

### Abrir do Card
- Botão **"Editar"** em cada card da galeria
- Abre SVG diretamente no editor

### Abrir do Modal
- Botão **"Editar"** no modal de preview
- Carrega SVG com nome do arquivo

### Navegação
- Switch **Gallery ↔ Editor** no header
- Mantém contexto ao alternar views

### API JavaScript
```javascript
// Abrir SVG no editor programaticamente
openInEditor(svgCode, fileName);
```

---

## 🔔 Sistema de Notificações (Toast)

### Estados
- **Sucesso**: Ações completadas com êxito
- **Erro**: Falhas com mensagem explicativa

### Comportamento
- Auto-dismiss após alguns segundos
- Posicionamento fixo na tela
- Animação suave de entrada/saída

---

## 📁 Operações de Arquivo

### Upload (Carregar SVG)
- Abre seletor de arquivo do sistema
- Aceita arquivos `.svg`
- Carrega conteúdo no editor
- Atualiza nome do arquivo

### Copiar Código
- Copia código SVG para clipboard
- Feedback visual com toast

### Download
- Baixa arquivo SVG
- Usa nome do arquivo atual
- Formato: `<filename>.svg`

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + Scroll` | Zoom in/out no preview |
| `Ctrl + Click + Arraste` | Pan no preview |
| `Tab` | Inserir 2 espaços (indentação) |
| `Esc` | Fechar modais |

---

## 🎯 Como Usar

### 1. Acessar o Editor
- Clique no botão **"Editor"** no header da aplicação
- Ou clique em **"Editar"** em qualquer card da galeria

### 2. Carregar SVG
- Clique em **"Carregar SVG"** para abrir arquivo do sistema
- Ou cole código SVG diretamente no editor
- Ou clique em "Editar" em um ícone da galeria

### 3. Visualizar em Tempo Real
- O preview atualiza automaticamente conforme você digita
- Use os controles de zoom para ajustar a visualização
- Toggle grid/checkered para auxiliar no posicionamento

### 4. Transformar SVG
- Use as ferramentas de rotação e flip
- Ajuste dimensões com bloqueio proporcional

### 5. Otimizar com SVGO
- Clique no botão **SVGO**
- Configure os plugins desejados
- Veja a comparação antes/depois
- Aplique a otimização

### 6. Exportar
- Escolha a aba de exportação desejada
- **Preview**: Visualização com zoom
- **React**: Componente JSX
- **React Native**: Template com react-native-svg
- **PNG**: Imagem com escala configurável
- **Data URI**: URI codificada

---

## 🌓 Tema Claro/Escuro

### Adaptação Automática
- Cores do editor adaptam ao tema
- Preview respeita tema global
- Syntax highlighting com cores apropriadas

### Favicon Dinâmico
- Favicon muda conforme o tema
- Dark mode: fundo escuro
- Light mode: fundo claro

---

## 📱 Responsividade

### Desktop (≥ 900px)
- Layout horizontal (editor | preview)
- Todas as ferramentas visíveis

### Mobile (< 900px)
- Layout vertical (editor acima, preview abaixo)
- Botões otimizados
- Divisor ajustado para arrastar verticalmente

---

## 🚀 Arquitetura Técnica

### Módulos JavaScript

```
js/modules/
├── viewManager.js              # Gerencia troca Gallery ↔ Editor
├── editorManager.js            # Orquestrador principal do editor
├── editorCodeManager.js        # Gerencia o editor de código
├── editorPreviewManager.js     # Gerencia o preview ao vivo
├── editorToolsManager.js       # Ferramentas principais
├── editorExportManager.js      # Exportação multi-formato
├── editorTabManager.js         # Sistema de abas de exportação
├── editorTransformManager.js   # Rotação, flip
├── editorDimensionsManager.js  # Editor de dimensões
├── editorSvgoManager.js        # Integração SVGO
├── editorSvgMapper.js          # Mapeamento SVG para React/RN
├── editorSyntaxHighlighter.js  # Syntax highlighting customizado
├── svgColorDetector.js         # Detecção monocromático/multicolorido
└── toast.js                    # Notificações
```

### Arquivos CSS

```
css/components/
├── editor.css       # Estilos completos do editor
├── svgo-modal.css   # Modal de configuração SVGO
└── toast.css        # Notificações toast
```

### Tecnologias
- **Zero Dependências de Runtime**: 100% vanilla JavaScript
- **CDN apenas para**: CodeMirror (syntax), SVGO (otimização), Prism (highlight)
- **ES6 Modules**: Arquitetura modular e organizada
- **CSS Variables**: Sistema de design consistente
- **Native APIs**: DOMParser, Canvas, Clipboard, FileReader

---

## 🐛 Tratamento de Erros

### Sintaxe Inválida
- Mostra erro no preview
- Indica linha do problema quando possível

### Arquivo Vazio
- Mostra placeholder informativo

### Clipboard Falhou
- Abre modal com código para copiar manualmente
- Alternativa para navegadores sem suporte

### Export Falhou
- Exibe mensagem de erro clara
- Toast com informação do problema

---

## ✅ Funcionalidades Implementadas

- [x] Syntax highlighting customizado para SVG/XML
- [x] Preview ao vivo sincronizado com código
- [x] Zoom de 10% a 5000%
- [x] Pan com Ctrl+mouse
- [x] Toggle grid e checkered background
- [x] Rotação 90°/-90°
- [x] Espelhamento horizontal/vertical
- [x] Editor de dimensões com proporções
- [x] Modal SVGO com 20+ opções
- [x] Exportação React JSX (TypeScript opcional)
- [x] Exportação React Native
- [x] Exportação PNG com escalas 1x-4x
- [x] Exportação Data URI (base64 e encoded)
- [x] Detecção inteligente de cores
- [x] Resolução de CSS classes para atributos
- [x] Integração com galeria (botão Editar)
- [x] Sistema de toast para notificações
- [x] Tema claro/escuro adaptativo

---

## 🔮 Próximas Melhorias (v3.0)

- [ ] Edição visual de paths (pontos de controle)
- [ ] Gerenciamento de camadas
- [ ] Color picker inline
- [ ] Histórico de arquivos recentes
- [ ] Buscar e substituir
- [ ] Auto-complete de tags SVG
- [ ] Salvar rascunhos no localStorage

---

**Desenvolvido com ❤️ para SVGaze**
