@echo off
if /I not "%~1"=="--hidden" (
  wscript //nologo "%~dp0start-hidden.vbs"
  exit /b 0
)
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
  call :fail_pause "Nao encontrei o servidor: %SERVER%"
  exit /b 1
)

rem Windowless Python: pyw creates no console. python.exe would open "career-cockpit".
set "USE_PYW="
where pyw >nul 2>&1 && set "USE_PYW=1"
if not defined USE_PYW (
  call :fail_pause "Python sem janela nao encontrado. Instale Python 3.10+ e tente de novo."
  exit /b 1
)

rem A previous launch may still be the visible career-cockpit console. Replace that one.
powershell -NoProfile -Command ^
  "$conns = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue;" ^
  "foreach ($c in $conns) { $p = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue;" ^
  "  if ($p -and $p.MainWindowTitle -eq 'career-cockpit') { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } }" >nul 2>&1

rem Already healthy?
call :health_ok
if not errorlevel 1 goto :OPEN

rem Port may be held by a dead/hung process — free it, then start fresh
powershell -NoProfile -Command ^
  "$conns = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue;" ^
  "foreach ($c in $conns) { $procId = $c.OwningProcess; if ($procId -and $procId -ne 0) {" ^
  "  try { Stop-Process -Id $procId -Force -ErrorAction Stop }" ^
  "  catch {} } }" >nul 2>&1

pushd "%ROOT%"
start "" pyw -3 "%SERVER%" --port %PORT%
popd

rem Wait for /health (avoid `timeout` — it fails when stdin is redirected)
set /a "TRIES=0"
:WAIT
set /a "TRIES+=1"
powershell -NoProfile -Command "Start-Sleep -Milliseconds 400" >nul 2>&1
call :health_ok
if not errorlevel 1 goto :OPEN
if %TRIES% LSS 30 goto :WAIT

call :fail_pause "O servidor nao respondeu em %HEALTH%."
exit /b 1

:OPEN
call :find_chrome
if defined CHROME (
  rem Separate profile so this window does not join an already running Chrome.
  start "" "%CHROME%" --user-data-dir="%LOCALAPPDATA%\career-cockpit-chrome" --no-first-run --no-default-browser-check --new-window "%URL%"
) else (
  echo Chrome nao encontrado. Abrindo no navegador padrao.
  start "" "%URL%"
)
endlocal
exit /b 0

:fail_pause
powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('%~1','Career cockpit')" >nul 2>&1
exit /b 0

:find_chrome
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
exit /b 0

:health_ok
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%HEALTH%' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
exit /b %ERRORLEVEL%
