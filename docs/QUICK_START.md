# 🚀 Quick Start - SVGaze

## TL;DR

### Windows
```bash
# Duplo clique em: start-local.bat
```

### Linux/Mac
```bash
# Rodar script:
./start-local.sh
```

### Qualquer Sistema (Python)
```bash
python -m http.server 8000
# Abrir: http://localhost:8000
```

---

## ⚡ Início Rápido

### 1️⃣ Iniciar Servidor HTTP

#### Opção A: Script Automático (Recomendado)

**Windows:**
```bash
# Duplo clique em:
start-local.bat
```

**Linux/Mac:**
```bash
# No terminal:
./start-local.sh
```

**O que o script faz:**
- ✅ Verifica se Node.js está instalado
- ✅ Inicia servidor na porta 3000
- ✅ Abre navegador automaticamente
- ✅ Mostra instruções claras

#### Opção B: Manualmente

**Python:**
```bash
cd /caminho/para/SVGaze
python -m http.server 8000
# Ou: python3 -m http.server 8000
```

**Node.js:**
```bash
npx serve -l 3000
```

**VSCode:**
- Instalar extensão "Live Server"
- Botão direito → Open with Live Server

### 2️⃣ Abrir no Navegador
```
http://localhost:8000
```

### 3️⃣ Selecionar Pasta
1. Clicar botão "Selecionar pasta"
2. Navegar até `icons/` (na raiz do projeto)
3. Selecionar e confirmar

### 4️⃣ Verificar
**Deve aparecer:**
- ✅ Categorias: Brands, Communication, Devices, Files, General, Interface, Media, Navigation, Status
- ✅ Cards com badges azuis "Outline" ou "Solid"
- ✅ Console sem erros (F12)

---

## 🎯 O Que Testar

### Categorização Inteligente
1. Filtrar por "Brands"
2. Ver ícones de **duas** pastas:
   - `icons/Outline/Brands/`
   - `icons/Solid/Brands/`
3. Cada um com badge correto

### Funcionalidades
- 🎨 Mudar cor → ícones mudam
- 📏 Mudar tamanho → ícones crescem/diminuem
- 🔍 Buscar → filtra instantaneamente
- ⭐ Favoritar → estrela fica dourada
- 📂 Modal → preview grande
- 📋 Copiar → código no clipboard
- ⬇️ Download → arquivo baixado

---

## ✅ Tudo Certo?

**Console mostra:**
```
🎨 SVGaze initializing...
✅ SVGaze initialized successfully
Successfully processed 145 SVG files
Categorization Stats: {...}
```

**Sem erros vermelhos!**

---

## ❌ Deu Erro?

### "Failed to load module"
**→ Use servidor HTTP** (métodos acima)

### Página em branco
**→ Verifique console (F12)**

### Categorias erradas
**→ Abra issue no GitHub com print**

---

## 📚 Mais Informações

- **Testes completos:** [HOW_TO_TEST.md](HOW_TO_TEST.md)
- **Documentação:** [CATEGORIZATION.md](CATEGORIZATION.md)
- **Roadmap:** [ROADMAP.md](ROADMAP.md)
- **Solução de problemas:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Dúvidas?** Abra issue no GitHub! 🚀
