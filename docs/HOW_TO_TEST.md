# 🚀 Como Testar o SVGaze Localmente

## ✅ Método Mais Fácil: Script Automático

### Opção A: Windows
1. **Duplo clique** em `start-local.bat`
2. Aguarde o navegador abrir automaticamente
3. Pronto! 🎉

### Opção B: Linux/Mac
1. Abrir terminal na pasta do projeto
2. Executar: `./start-local.sh`
3. Aguarde o navegador abrir automaticamente
4. Pronto! 🎉

**O que o script faz:**
- ✅ Verifica se Node.js está instalado
- ✅ Inicia servidor na porta 3000
- ✅ Abre navegador automaticamente (macOS, Linux, WSL)
- ✅ Mostra instruções claras

**Se Node.js não estiver instalado:**
- Download: https://nodejs.org/ (escolha LTS)
- Instalar
- Executar script novamente

---

### Opção C: VSCode Live Server (Recomendado para Desenvolvimento)

#### Primeira vez (configurar):
1. Abrir VSCode
2. Abrir pasta do projeto: `File → Open Folder` → SVGaze
3. Ir em Extensions (Ctrl+Shift+X)
4. Buscar "Live Server"
5. Instalar extensão do **Ritwick Dey**

#### Toda vez que quiser testar:
1. Abrir `index.html` no VSCode
2. **Botão direito** no código
3. Clicar "**Open with Live Server**"
4. Abre automaticamente! ✅

**Vantagens:**
- 🔥 Hot reload (salva e atualiza automático)
- 🎨 Vê mudanças instantaneamente
- 💯 Não precisa terminal

---

## 🧪 Testando o App

### 1. Selecionar Pasta de Ícones
- Clicar botão "**Selecionar pasta**"
- Navegar até `icons/` (na raiz do projeto)
- Confirmar

### 2. Verificar Categorias
**Deve aparecer no filtro:**
```
Todas as categorias
Brands
Communication
Devices
Files
General
Interface
Media
Navigation
Status
```

**NÃO deve aparecer:**
- ❌ Outline
- ❌ Solid
- ❌ icons (pasta raiz)

### 3. Verificar Badges
Cada card deve ter:
- 🔵 **Badge azul** → "Outline" ou "Solid"
- Nome do arquivo
- Botões: ★ Abrir Copiar Baixar

### 4. Testar Filtro
- Selecionar "**Brands**" no filtro
- Deve mostrar ícones de:
  - `icons/Outline/Brands/`
  - `icons/Solid/Brands/`
- Ambos na mesma lista!
- Cada um com seu badge correto

### 5. Testar Funcionalidades da Galeria
- [ ] **Busca:** Digite "Adobe" → filtra
- [ ] **Cor:** Mude cor → ícones mudam
- [ ] **Tamanho:** Arraste slider → ícones crescem
- [ ] **Favorito:** Clique ★ → fica dourado
- [ ] **Modal:** Clique "Abrir" → preview grande
- [ ] **Copiar:** Clique "Copiar" → código copiado
- [ ] **Download:** Clique "Baixar" → arquivo baixado
- [ ] **Editar:** Clique "Editar" → abre no Editor

---

## ✏️ Testando o Editor SVG

### 1. Acessar o Editor
- [ ] Clicar botão **"Editor"** no header
- [ ] Ou clicar **"Editar"** em qualquer card da galeria
- [ ] Editor deve abrir com interface split-pane

### 2. Carregar SVG
- [ ] Clicar **"Carregar SVG"** → selecionar arquivo
- [ ] Arquivo carrega no editor
- [ ] Nome do arquivo atualiza
- [ ] Preview mostra o SVG

### 3. Editar Código
- [ ] Digitar/colar código SVG no editor
- [ ] Preview atualiza em tempo real
- [ ] Syntax highlighting funciona (cores nas tags)
- [ ] Tab insere 2 espaços

### 4. Controles de Preview
- [ ] **Zoom +/-:** Botões funcionam
- [ ] **Ctrl + Scroll:** Zoom com mouse funciona
- [ ] **Fit to View:** Ajusta ao tamanho da área
- [ ] **Pan:** Ctrl + Click + Arraste move o preview
- [ ] **Grid toggle:** Liga/desliga grade
- [ ] **Checkered toggle:** Liga/desliga fundo xadrez
- [ ] **Dimensões:** Mostra largura × altura

### 5. Ferramentas de Transformação
- [ ] **Rotação 90° horário:** SVG gira para direita
- [ ] **Rotação 90° anti-horário:** SVG gira para esquerda
- [ ] **Flip Horizontal:** Espelha horizontalmente
- [ ] **Flip Vertical:** Espelha verticalmente
- [ ] **Editor de dimensões:** Altera tamanho com proporções

### 6. Otimização SVGO
- [ ] Clicar botão **SVGO** → modal abre
- [ ] Configurar plugins (checkboxes)
- [ ] Clicar **Otimizar** → código otimizado
- [ ] Mostra comparação: "578 bytes → 493 bytes (-15%)"
- [ ] **Reset** restaura configurações padrão

### 7. Abas de Exportação
- [ ] **Preview:** Mostra SVG com controles de zoom
- [ ] **React:** Gera componente JSX
  - [ ] Toggle TypeScript funciona
  - [ ] Toggle aspas simples funciona
  - [ ] Botão Copiar copia código
- [ ] **React Native:** Mostra template com instruções
  - [ ] Botão Copiar funciona
- [ ] **PNG:** Mostra preview da imagem
  - [ ] Seletor de escala (1x-4x) funciona
  - [ ] Botão Download baixa PNG
- [ ] **Data URI:** Mostra URI codificada
  - [ ] Toggle base64/encoded funciona
  - [ ] Botão Copiar funciona

### 8. Integração com Galeria
- [ ] Clicar "Editar" no card → abre no Editor com SVG
- [ ] Clicar "Editar" no modal → abre no Editor com SVG
- [ ] Nome do arquivo aparece no editor
- [ ] Switch Gallery ↔ Editor no header funciona

### 9. Sistema de Toast
- [ ] Copiar código → toast "Copiado!" aparece
- [ ] Erro → toast vermelho aparece
- [ ] Toast desaparece automaticamente

### 10. Tema Claro/Escuro
- [ ] Editor adapta cores ao tema
- [ ] Syntax highlighting muda cores
- [ ] Preview adapta ao tema
- [ ] SVGs monocromáticos mudam cor (preto/branco)

---

## 🔍 Verificar Console (Debug)

### Abrir Console:
- Pressione **F12**
- Ou botão direito → "Inspecionar"
- Aba "**Console**"

### Mensagens esperadas:
```
🎨 SVGaze initializing...
✅ SVGaze initialized successfully
📂 Loaded 145 SVG files
Categorization Stats: {
  totalItems: 145,
  totalCategories: 9,
  totalStyles: 2,
  categories: {
    Brands: { count: 24, styles: ['Outline', 'Solid'] }
    ...
  }
}
```

### NÃO deve ter:
- ❌ Erros em vermelho
- ❌ "Failed to load module"
- ❌ "CORS policy"
- ❌ "Cannot find module"

---

## 🐛 Solução de Problemas

### Problema: "Failed to load module"
**Causa:** Abriu com duplo clique (protocolo `file://`)
**Solução:** Use `start-local.bat` ou Live Server

### Problema: Node.js não encontrado
**Solução:**
1. Instalar Node.js: https://nodejs.org/
2. Reiniciar terminal/VSCode
3. Tentar novamente

### Problema: Página em branco
**Debug:**
1. Abrir console (F12)
2. Ver mensagens de erro
3. Verificar se arquivos CSS/JS carregaram (aba Network)

### Problema: Categorias erradas
**Debug no console:**
```javascript
// Ver estrutura detectada
svgViewer.getAll()[0]._debug

// Ver todas categorias
svgViewer.getAll().map(i => i.category)
```

---

## ✅ Checklist de Testes

### Funcionalidades da Galeria:
- [ ] Servidor HTTP funcionando
- [ ] Ícones carregam da pasta `icons/`
- [ ] Categorias corretas (Brands, Communication, etc)
- [ ] Badges aparecem (Outline, Solid)
- [ ] Busca funciona
- [ ] Filtro funciona
- [ ] Cor e tamanho funcionam
- [ ] Modal abre e fecha
- [ ] Copiar e download funcionam
- [ ] Botão "Editar" funciona
- [ ] Console sem erros

### Funcionalidades do Editor:
- [ ] Editor abre corretamente
- [ ] Carregar SVG funciona
- [ ] Syntax highlighting funciona
- [ ] Preview ao vivo funciona
- [ ] Zoom e pan funcionam
- [ ] Rotação e flip funcionam
- [ ] SVGO otimiza corretamente
- [ ] Exportação React funciona
- [ ] Exportação React Native funciona
- [ ] Exportação PNG funciona
- [ ] Exportação Data URI funciona
- [ ] Toast notifications aparecem
- [ ] Integração com galeria funciona
- [ ] Tema claro/escuro adapta

---

## 🎯 Quick Reference

| Ação | Comando/Método |
|------|----------------|
| Iniciar servidor | Duplo clique `start-local.bat` |
| VSCode Live Server | Botão direito → Open with Live Server |
| Ver console | F12 |
| Debug categorias | `svgViewer.getAll()[0]._debug` |
| Hard refresh (sem cache) | Ctrl+Shift+R |

---

## 💡 Dicas

### Para Testes Efetivos:
- Use **VSCode Live Server** → hot reload automático
- Mantenha console aberto (F12) → vê erros na hora
- Use `Ctrl+Shift+R` → hard refresh sem cache
- Teste em diferentes navegadores (Chrome, Firefox, Safari)
- Teste com diferentes estruturas de pastas
- Verifique console sempre para detectar problemas

---

## 🚀 Você está pronto!

1. **Duplo clique** em `start-local.bat`
2. **Selecionar pasta** `icons/`
3. **Ver mágica acontecer** ✨

**Problemas?** Veja `TROUBLESHOOTING.md` ou abra issue! 🎯
