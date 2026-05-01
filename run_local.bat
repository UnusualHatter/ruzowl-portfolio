@echo off
SETLOCAL EnableDelayedExpansion

SET PORT=3000
echo.
echo ===================================================
echo    RuzOwl Portfolio Redesign - Local Preview
echo ===================================================
echo.

:: Ensure we are in the project root
cd /d "%~dp0"

:: Check if redesign folder exists
if not exist "redesign" (
    echo ERROR: "redesign" folder not found. 
    echo Please make sure this .bat file is in the project root.
    pause
    exit /b
)

echo [1/2] Checking for available server...

:: Try Node.js (npx serve)
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Found Node.js! Using 'serve' to host the redesign.
    echo The site will open at http://localhost:%PORT%
    echo.
    echo Press Ctrl+C to stop the server.
    echo.
    
    :: Open browser
    start http://localhost:%PORT%
    
    :: Run serve from the redesign directory
    cd redesign
    npx -y serve -l %PORT% .
    goto end
)

:: Try Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Found Python! Using 'http.server' to host the redesign.
    echo The site will open at http://localhost:%PORT%
    echo.
    echo Press Ctrl+C to stop the server.
    echo.
    
    :: Open browser
    start http://localhost:%PORT%
    
    :: Run python server from the redesign directory
    cd redesign
    python -m http.server %PORT%
    goto end
)

echo.
echo ===================================================
echo  ERROR: No server found!
echo ===================================================
echo To run this project locally, you need either:
echo 1. Node.js installed (Recommended) - https://nodejs.org
echo 2. Python 3 installed - https://python.org
echo.
pause

:end
ENDLOCAL
