rem check Readme for more information!

rem set name
set name=myGame

rem remove old files
del %name%.zip index.min.html
rmdir /s /q tmp

rem move code
mkdir tmp
type ..\code\game.js >> tmp\game.js
echo.>> tmp\game.js

rem minify html
call html-minifier-terser -o tmp\minified_index.html --collapse-whitespace --no-html5 --remove-comments --minify-css true -- ..\code\index.html
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem rewrite optimized javascript with google closure compiler
call google-closure-compiler --js tmp\game.js --js_output_file tmp\gcc_game.js --compilation_level ADVANCED --emit_use_strict=false --language_out ECMASCRIPT_2019 --warning_level VERBOSE --jscomp_off=checkVars --assume_function_wrapper
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem minification with terser
call terser -o tmp\tersed_game.js --compress --mangle -- tmp\gcc_game.js
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem flat code with roadroller
rem call roadroller export\game.js -o export\game.js -t js -a eval -S 0,1,2,3,6,7,13,21,25,42,50,57 -M 150 -Zpr 16 -Zlr 500 -Zmc 5 -Zmd 20 -Zdy -1 -Zab 64
call roadroller tmp\tersed_game.js -o tmp\roadrolled_game.js 
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem add js to html
type tmp\minified_index.html >> tmp\index.html
echo ^<script^> >> tmp\index.html
type tmp\roadrolled_game.js >> tmp\index.html
echo ^</script^> >> tmp\index.html

rem zip the index
cd tmp
call advzip -a -4 -i 99 ..\%name%.zip index.html
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem optimize zip with ect
cd ..
ect-0.8.3.exe -9 -zip %name%.zip
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem echo file size
set file=%name%.zip
FOR /F "usebackq" %%A IN ('%file%') DO set size=%%~zA
echo.zip size is %size% bytes

pause