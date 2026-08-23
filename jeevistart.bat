@echo off
setlocal

rem Start the Jeevitham frontend from this script's folder.
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required to start Jeevitham.
  echo Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing project dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting Jeevitham at http://localhost:5173/
rem Vite opens the browser only after its server is ready.
call npm.cmd run dev -- --host 127.0.0.1 --open
