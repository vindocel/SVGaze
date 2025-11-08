#!/bin/bash

echo ""
echo "========================================"
echo "  SVGaze - Local Development Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js não encontrado!"
    echo ""
    echo "Por favor, instale Node.js:"
    echo "https://nodejs.org/"
    echo ""
    echo "Ou use Python (se disponível):"
    echo "  python3 -m http.server 3000"
    echo ""
    echo "Ou use VSCode Live Server:"
    echo "  1. Instalar extensão 'Live Server'"
    echo "  2. Botão direito em index.html"
    echo "  3. 'Open with Live Server'"
    echo ""
    exit 1
fi

echo "[OK] Node.js encontrado!"
echo ""
echo "Iniciando servidor local..."
echo ""
echo "Quando o servidor iniciar:"
echo "  - URL: http://localhost:3000"
echo "  - Pressione Ctrl+C para parar"
echo ""
echo "========================================"
echo ""

# Try to open browser (works on macOS and most Linux distros)
if command -v open &> /dev/null; then
    # macOS
    sleep 2 && open http://localhost:3000 &
elif command -v xdg-open &> /dev/null; then
    # Linux
    sleep 2 && xdg-open http://localhost:3000 &
elif command -v wslview &> /dev/null; then
    # WSL (Windows Subsystem for Linux)
    sleep 2 && wslview http://localhost:3000 &
fi

# Start server
npx serve -l 3000
