# js13kGames 2021 Template
Hi! 

This template is somewhat a re-organized, updated, cleaner version of what I used to create [PACKABUNCHAS](https://js13kgames.com/entries/packabunchas),my entry for [js13kGames](https://js13kgames.com) 2021. 
It includes some features that I personally see as "standards" in the field of making games in 13kb and that I'd like to re-use in future games :)

It is a single chunk divided in different sections that you can use as snippets in your own project.

These features, in order of importance/reusability are:

 - build process
 - automatic canvas screen centering and resize
 - emoji as favicon
 - background music
 - sound effects
 - fullscreen toggle
 - click & tap handling (according to resize, too)
 - desktop and mobile compatibility
 - local storage save data object
 - 2d context
 - basic game loop and draw
 - window focus handling (like to mute sounds)
 - mute toggle (saved to storage, too)
 - font (websafe fonts)
 - automatic build tools (optional)


Clearly this leaves out many other features like particles, physics, keyboard, dedicated fonts etc.
But it can be a good reference, with ready-to-copy snippets, for universal features like music, build process, fullscreen toggle, canvas centering.

Check game.js for all the details on every single feature.

### HOW TO USE THIS TEMPLATE

You can use test.html to test the game as it is, build it manually or using automated tools (see build section below).
At start, number of clicks and mute state are loaded and logged. Every click the mouse position is logged and number of clicks is increated, to test the local storage and mouse position feature.
Clicking the top part of the screen will toggle fullscreen, while the bottom part will toggle the mute state.
The first click will start the music, and after that, each click triggers a sound effect.
Keep the inspector on to check console logs!

The code is a single chunk divided in different sections, all commented. Check game.js for details!

### BUILD
The build process is what really makes it possible to pack everything under 13kb.
For real, it's the most important part. And you can do it manually with online tools, or with the automated ones in this template.

##### Manual Build

Not elegant but it works fine, this is what I used for PACKABUNCHAS due to lack of time!

1) Use [google closure compiler](https://developers.google.com/closure/compiler) on game.js
2) Use [terser](https://github.com/terser/terser) on the generated code.
3) Use [roadroller](https://lifthrasiir.github.io/roadroller/) on the generated code
4) Minify index.html with any tool like this [html-minifier](https://terser.org/html-minifier-terser/)
5) Put the roadrolled code at the end of the index file inside <script></script> (removing <script src = "game.js"></script>)
6) Zip index.html at maximum compression (with any zipper)
7) use [ECT](https://github.com/fhanau/Efficient-Compression-Tool/releases/tag/v0.8.3) on the zip


##### Automated build
But, of course, we can also automate the above steps! :D
We could use grunt, gulp, webpack or whatever, but for this template I used a solution that I found somewhat cleaner as much more readable: a batch build.

Once again I'll summon [KilledByAPixel](https://twitter.com/KilledByAPixel) here, who used [this build method](https://github.com/KilledByAPixel/SpaceHuggers/tree/main/engine/build) for his 2021 js13kGames entry [Space Huggers](https://github.com/KilledByAPixel/SpaceHuggers), which I took and adapted for my template and needs.


How to use the automated build?
1) Run install_build_tools.bat to install all the needed tools
2) (Optional) Edit build bat with your game name  by changing "myGame"
3) Run build.bat.

It basically does the same steps of the manual build but automatically :P

The build.bat is pretty much readable: it will create a zip ready to be submitted as js13kGames entry and it will create a tmp folder with all the steps from the manual build, which I think it's really useful sometimes, to check what code parts can be optimied better.

The default arguments passed to the build tools are the one I've used for PACKABUNCHAS, but you can easily adjust them.
Oh, and the process will also pause at the end to show you the filesize so you are sure your zip is under 13kb!

Note: 
If you take this template as-is you can see that it is "already" as big as like 3kb. 
It may seem much, but you'll see that it won't increase that much while developing your game!
Believe me, thanks to Roadroller, which is specifically optimized for j13kGames, it'll seem like you have infinite bytes!
No, for real, with these tools, the time limit of 1 month weighted more than the file size one!

### CREDITS

Okay, thanks for checking my toughts on js13kGames tools of choice :)
As you can see this template is a mix of solutions I've taken around, so it was only possible thanks to:
 - [Andrzej Mazur](https://twitter.com/end3r) for organizing js13kGames :)
 - [Frank Force](https://twitter.com/KilledByAPixel) for his ZzFX, build process and inspiring work!
 - [Keith Clark](https://twitter.com/keithclarkcouk) for his awesome ZzFXM!
 - [Kang Seonghoon](https://github.com/lifthrasiir) for roadroller and the help he gave me through discord :)
 - [xem](https://twitter.com/maximeeuziere) for all the golfing tips and tutorials.
 - All the people in the coding communities like js13k and stackoverflow for sharing their code and ideas!
 
Thank you very much guys, keep up with the awesome work!

For anything, feel free to contact me at:  
https://github.com/MattiaFortunati  
http://www.mattiafortunati.com  
mattia@mattiafortunati.com
