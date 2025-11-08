@echo off
echo.
echo ========================================
echo   SVGaze - Local Development Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js nao encontrado!
    echo.
    echo Por favor, instale Node.js:
    echo https://nodejs.org/
    echo.
    echo Ou use VSCode Live Server:
    echo 1. Instalar extensao "Live Server"
    echo 2. Botao direito em index.html
    echo 3. "Open with Live Server"
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado!
echo.
echo Iniciando servidor local...
echo.
echo Quando o servidor iniciar:
echo - URL: http://localhost:3000
echo - Pressione Ctrl+C para parar
echo.
echo ========================================
echo.

REM Start server and open browser
start http://localhost:3000
npx serve -l 3000

pause
