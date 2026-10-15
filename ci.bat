@echo off
rem Run all npm commands with call so this batch file continues.
cd /d "%~dp0"
call npm ci || exit /b 1
call npm test || exit /b 1
call npm run build || exit /b 1

set "OUTPUT="
for /f "delims=" %%L in ('build\hello.exe') do set "OUTPUT=%%L"
if not "%OUTPUT%"=="Hello, World!" exit /b 1

echo CI OK
