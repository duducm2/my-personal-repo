@echo off
setlocal
cd /d "%~dp0"

set "ROOT=%~dp0.."
set "PY="
where py >nul 2>&1 && set "PY=py -3"
if not defined PY where python >nul 2>&1 && set "PY=python"
if not defined PY (
  echo Python 3 nao encontrado. Instale Python 3.10+ e tente de novo.
  exit /b 1
)

set "PORT=8770"

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:%PORT%/health' -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  start "career-cockpit" %PY% "%ROOT%\python\career_server.py" --port %PORT%
  timeout /t 2 /nobreak >nul
)

start "" "http://127.0.0.1:%PORT%/"
endlocal
