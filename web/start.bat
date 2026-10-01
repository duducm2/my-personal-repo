@echo off
setlocal EnableExtensions
cd /d "%~dp0"

rem Resolve repo root (parent of web/) to a clean absolute path
pushd "%~dp0.."
set "ROOT=%CD%"
popd

set "PORT=8770"
set "SERVER=%ROOT%\python\career_server.py"
set "URL=http://127.0.0.1:%PORT%/"
set "HEALTH=http://127.0.0.1:%PORT%/health"

if not exist "%SERVER%" (
  echo Nao encontrei o servidor:
  echo   %SERVER%
  pause
  exit /b 1
)

rem Prefer the py launcher, then python on PATH
set "USE_PY="
where py >nul 2>&1 && set "USE_PY=1"
if not defined USE_PY where python >nul 2>&1 || (
  echo Python 3 nao encontrado. Instale Python 3.10+ e tente de novo.
  pause
  exit /b 1
)

rem Already healthy?
call :health_ok
if not errorlevel 1 goto :OPEN

rem Port may be held by a dead/hung process — free it, then start fresh
powershell -NoProfile -Command ^
  "$conns = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue;" ^
  "foreach ($c in $conns) { $procId = $c.OwningProcess; if ($procId -and $procId -ne 0) {" ^
  "  try { Stop-Process -Id $procId -Force -ErrorAction Stop }" ^
  "  catch {} } }" >nul 2>&1

echo Iniciando career cockpit em %URL% ...
rem Do NOT quote the executable name after START — Windows then looks for a file
rem with that literal name. Title must be quoted; script path must be quoted.
pushd "%ROOT%"
if defined USE_PY (
  start "career-cockpit" /MIN py -3 "%SERVER%" --port %PORT%
) else (
  start "career-cockpit" /MIN python "%SERVER%" --port %PORT%
)
popd

rem Wait for /health (avoid `timeout` — it fails when stdin is redirected)
set /a "TRIES=0"
:WAIT
set /a "TRIES+=1"
powershell -NoProfile -Command "Start-Sleep -Milliseconds 400" >nul 2>&1
call :health_ok
if not errorlevel 1 goto :OPEN
if %TRIES% LSS 30 goto :WAIT

echo.
echo O servidor nao respondeu em %HEALTH%
echo Verifique a janela "career-cockpit" para erros do Python.
pause
exit /b 1

:OPEN
start "" "%URL%"
endlocal
exit /b 0

:health_ok
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%HEALTH%' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
exit /b %ERRORLEVEL%
