@echo off
echo Frontend es Backend szerverek inditasa...

REM Check if Frontend folder exists
if not exist "Frontend\" (
    echo Hiba: Frontend mappa nem talalhato!
    goto end
)

REM Check if Server folder exists
if not exist "Server\" (
    echo Hiba: Server mappa nem talalhato!
    goto end
)

REM Install Node packages only if not installed
if not exist "Frontend\node_modules" (
    echo Telepites: Frontend npm csomagok...
    pushd Frontend
    call npm install
    popd
)

if not exist "Server\node_modules" (
    echo Telepites: Backend npm csomagok...
    pushd Server
    call npm install
    popd
)

REM Start servers
start cmd /k "cd Frontend && npm run dev -- --host"
start cmd /k "cd Server && node server.js"

echo Mindket szerver fut.
pause

:end