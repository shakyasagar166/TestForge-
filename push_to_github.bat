@echo off
echo ========================================================
echo   TestForge - Push to GitHub
echo   Repository: https://github.com/shakyasagar166/TestForge.git
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Git status...
git status

echo.
echo [2/4] Staging all files...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "feat: complete TestForge - AI-powered Software Testing and QA Automation Platform"

echo.
echo [4/4] Pushing to GitHub (origin main)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo URL: https://github.com/shakyasagar166/TestForge
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo [NOTE] Push failed. If the repository does not exist yet:
    echo 1. Go to https://github.com/new
    echo 2. Repository name: TestForge
    echo 3. Keep it Public and DO NOT initialize with README/license
    echo 4. Click 'Create repository'
    echo 5. Run this script again: push_to_github.bat
    echo ========================================================
)

pause
