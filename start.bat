@echo off
title RuzOwl Portfolio — Local Dev Server
echo.
echo  RuzOwl Portfolio
echo  ─────────────────────────────────────
where python >nul 2>&1
if %errorlevel% == 0 (
  echo  Serving at http://localhost:8080
  echo  Press Ctrl+C to stop.
  echo.
  start "" http://localhost:8080
  python -m http.server 8080
  goto :eof
)
where python3 >nul 2>&1
if %errorlevel% == 0 (
  echo  Serving at http://localhost:8080
  echo  Press Ctrl+C to stop.
  echo.
  start "" http://localhost:8080
  python3 -m http.server 8080
  goto :eof
)
where npx >nul 2>&1
if %errorlevel% == 0 (
  echo  Serving via npx serve at http://localhost:8080
  echo  Press Ctrl+C to stop.
  echo.
  start "" http://localhost:8080
  npx serve -p 8080
  goto :eof
)
echo  ERROR: No server found. Install Python (python.org) or Node.js (nodejs.org).
pause
