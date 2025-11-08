# 🔧 Solução de Problemas - SVGaze

## ❌ Problema: SVGs Detectados mas Não Aparecem

### Causa
Você abriu o arquivo com duplo clique (`file://` protocol), mas ES6 modules precisam de servidor HTTP.

### Erro no Console (F12)
Provavelmente aparece:
```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

---

## ✅ SOLUÇÃO RÁPIDA

### Opção 1: Python (RECOMENDADO)
```bash
# Abrir terminal na pasta do projeto
cd /path/to/SVGaze

# Iniciar servidor
python -m http.server 8000

# Abrir navegador em:
http://localhost:8000
```

### Opção 2: Node.js
```bash
npx serve
```

### Opção 3: VSCode Live Server
1. Instalar extensão "Live Server"
2. Botão direito no `index.html` → "Open with Live Server"

---

## 🐛 OUTROS PROBLEMAS

### SVGs Carregam mas Categorias Erradas
**Ver:** Console (F12) → Procurar "Categorization Stats"
**Debug:**
```javascript
svgViewer.getAll()[0]
```

### Modal Não Abre
**Verificar:** Console tem erro de módulo?
**Solução:** Usar servidor HTTP

### Badges Não Aparecem
**Verificar:** CSS foi carregado?
**Solução:** Ver Network tab (F12) se arquivos CSS carregaram

---

## 📞 Precisa de Ajuda?

1. Abrir Console (F12)
2. Copiar mensagens de erro
3. Abrir issue no GitHub
