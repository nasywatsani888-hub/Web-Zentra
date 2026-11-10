@echo off
title ZENTRA - CNC Spindle Health Monitoring System
echo ========================================================
echo   ZENTRA - CNC Spindle Health Monitoring System
echo   Kembara UNYVerse 2026 x PT YPTI
echo ========================================================
echo.
echo Membuka ZENTRA Dashboard di browser default Anda...
start "" "%~dp0index.html"
echo.
echo ========================================================
echo   Dashboard ZENTRA Berhasil Dibuka!
echo   File: %~dp0index.html
echo   - 100%% Standalone (Tanpa perlu Python/Node.js)
echo   - Bebas Error, Langsung Siap Demo Lomba!
echo ========================================================
echo.
timeout /t 3 >nul
exit
