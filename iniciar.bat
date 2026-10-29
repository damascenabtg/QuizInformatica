@echo off
title Quiz de Informatica
cd /d "%~dp0"

rem Servidor em uma janela minimizada (feche essa janela para encerrar o quiz)
start "Servidor do Quiz" /min node server.js

rem Espera o servidor responder (ate ~15 s)
set /a tentativas=0
:espera
timeout /t 1 /nobreak >nul
curl -s -o nul http://localhost:3000/ && goto abrir
set /a tentativas+=1
if %tentativas% lss 15 goto espera
echo O servidor nao respondeu. Verifique se o Node.js esta instalado.
pause
exit /b 1

:abrir
rem Edge em modo quiosque: tela cheia, sem barra de endereco, abas ou menus.
rem Perfil separado para o quiosque funcionar mesmo com outro Edge aberto.
rem Para sair: Alt+F4.
start "" msedge --kiosk http://localhost:3000 --edge-kiosk-type=fullscreen --no-first-run --user-data-dir="%TEMP%\QuizQuiosque"
