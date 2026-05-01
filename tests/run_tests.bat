@echo off
title Gamminity Test Runner
echo.
echo Running Gamminity Platform Tests...
echo.
cd /d "%~dp0.."
call pnpm vitest run
echo.
echo Test run complete.
pause
