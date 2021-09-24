/*
js13kGames 2021 Template
by Mattia Fortunati
http://www.mattiafortunati.com
mattia@mattiafortunati.com

Hi! 

This template is somewhat a re-organized, updated, cleaner version of what I used to create PACKABUNCHAS
https://js13kgames.com/entries/packabunchas
my entry for js13kGames 2021
https://js13kgames.com 
and it includes some features that I personally see as "standards" in the field of making games in 13kb
and that I'd like to re-use in future games :)

It is a single chunk of code divided in different sections that you can use as snippets in your own project.

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
 - font (websafe font)
 - automatic build tools (optional)


Clearly this leaves out many other features like particles, physics, keyboard, dedicated fonts etc.
But it can be a good reference, with ready-to-copy snippets, for universal features like music, build process, fullscreen toggle, canvas centering.

Check Readme.md for other info.

*/


/*
===============================================   2D CONTEXT   ===============================================

Yeah, this setup is made for 2d context, but you can adapt it as you like.

Btw, just a note here: canvas id is "v" because other variables are reserved for Roadroller, one of the build tools.
You can see this issue along with other possible solutions here:
https://github.com/lifthrasiir/roadroller/issues/7

*/



//2d context
c = document.getElementById("v");
ctx = c.getContext("2d");
w = v.width
h = v.height


/*
===============================================   UPDATE / DRAW   ===============================================

Basic update function.
It's a simple requestAnimationFrame() usage.

Other things you can try are setInterval(), requestAnimationFrame() fixing FPS
https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe 
or a mix of the two, handling the draw part in requestAnimationFrame() and the logic in setInterval().

But I suggest you to start with a basic requestAnimationFrame() and maybe then change it accordingly to your game needs!

*/



function update() {
	drawGame()

	requestAnimationFrame(update)

}

update()


/*
===============================================   GAME FUNCTIONS   ===============================================

Just game mechanics.

But maybe a note on FONTS is needed:
There are different ways of adding dedicated fonts to js13kGames, but for PACKABUNCHAS I've decided to just use
web safe fonts.
Just use them with care because, as emojis, they differ depending on the device 
as they may be bigger, smaller, thicker or thinnier, so test them well! 

More info about web safe fonts here:
https://websitesetup.org/web-safe-fonts-html-css/

*/

function drawGame() {
	ctx.clearRect(0, 0, w, h);
	//DRAW BACKGROUND
	ctx.fillStyle = "#94DEC3"
	ctx.fillRect(0, 0, w, h)

	//Draw Text
	ctx.font = "bold 40px Tahoma";
	ctx.fillStyle = "#5D4E51";
	ctx.textAlign = "center";
	ctx.fillText("Click to start music", w / 2, h / 2);
	ctx.fillText("play sound effect", w / 2, h / 2 + 50);
	ctx.fillText("and add to saved clicks", w / 2, h / 2 + 100);
	ctx.fillText("(check console logs)", w / 2, h / 2 + 150);


	ctx.fillText("click here to toggle fullscreen", w / 2, h / 2 - 580);
	ctx.fillText("click here to toggle mute", w / 2, h / 2 + 580);
	ctx.fillText("music toggle state is loaded and saved", w / 2, h / 2 + 630);
}

function clickThings() {
	startMusic()
	playSound()

	//save clicks to storage
	storageData.clicks += 1
	saveData()

	//fullScreen and mute
	if (mouseY < h / 2) toggleFullscreen()
	else toggleMute()
}


/*
===============================================   MOUSE HANDLING   ===============================================

Here we handle mouse and tap down, move and up.

Correct coordinates:
First of all we need to get the RIGHT coordinates.
We need to calculate them using the canvas getBoundingClientRect and ClientX and ClientY coordinates.
It's basic math but to not waste any time, we can just use a getMousePos snippet found online :D

Mobile:
Then we need to make it crossplatform.
In index.html is already set with 
touch-action: none
which is needed to prevent scrolling, double taps and such on mobile devices, but we also need to add
e.preventDefault()
to avoid other possible problems.
So, for every touch event we pass the first touch to the relative mouse handling functions.

I've set it to only pass them if there is NO multi touch, because it was optimal for my game,
but I've left the check and the comments because more control may be needed.

*/

function mouseDown(e) {
	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y
	//console.log(mouseX, mouseY)
}

function mouseUp(e) {
	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y
	console.log("mouseX: " + Math.round(mouseX), "mouseY: " + Math.round(mouseY))


	clickThings()
}

function mouseMove(e) {
	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y
	//console.log(mouseX, mouseY)
}

function touchstart(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior
		//event.preventDefault()
	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseDown(touches[0])
		//}
	}
}

function touchend(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior

	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseUp(touches[0])
		//}
	}
}

function touchmove(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior

	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseMove(touches[0])
		//}
	}
}

this.onmousedown = mouseDown;
this.onmouseup = mouseUp;
this.onmousemove = mouseMove;

this.addEventListener('touchstart', touchstart, {
	passive: false
});
this.addEventListener('touchend', touchend, {
	passive: false
});
this.addEventListener('touchmove', touchmove, {
	passive: false
});

//https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
//https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMousePos(canvas, event) {
	var canvasBounds = canvas.getBoundingClientRect();

	//simple proportion ratio
	return {
		x: (event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left) * w,
		y: (event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top) * h
	};
}


/*
===============================================   STORAGE   ===============================================

The point here is to keep all the variable you need to store in a single object and just use
saveData() to save and loadData() to load everything.
The object will remain as it is and you'll just need to call save and load when needed.

Nothing new, just a standard that I've used a lot in many projects. 
In some special cases you may want to save different items instead of a single data object, 
but for js13kGames and such, I think that this approach can be pretty good :)

Oh, gamePrefix is there to be sure it is unique like no other game uses the same item name!

*/

function saveData() {
	localStorage.setItem(gameSaveDataName, JSON.stringify(storageData))
}

function loadData() {
	return JSON.parse(localStorage.getItem(gameSaveDataName))
}

gameSaveDataName = "gamePrefix_storageData"
storageData = loadData() || {
	clicks: 0,
	muted: false
}
console.log(storageData)


/*
===============================================   WINDOW FOCUS HANDLER   ===============================================

Sometimes it is really tricky to handle the mute/unmute feature catching the focus and unfocus events, while keeping everything 
crossplatform and considering the muted state saved in local storage, but since it's absolutely needed to avoid that background 
music keeps playing even when your game is closed or the window focus is changed, I've come up with a solution that can help.

Here focus and unfocus events calls the relative mute functions.

*/

function windowFocus() {
	muteHandleFocus()
}

function windowUnfocus() {
	muteHandleUnfocus()
}

this.addEventListener("focus", windowFocus, false);
this.addEventListener("blur", windowUnfocus, false);


/*
===============================================   MUTE TOGGLE   ===============================================

This is how I setup the mute in this template:

 - at initialization, the muted state is loaded (default is loaded if there's no data stored). Of course.
 - when the user clicks a toggle button, the toggleMute() will set the muted state, volume to .2 or 0, 
 	suspend or resume audio and save data.
 - at a first user interation, which is mandatory to play audio, the music is started and if the game is already muted, we set volume and suspend audio, 
 	like toggle does when muted is false.
 - at focus event, music is resumed only if it has already started and it's not muted
 - at unfocus event music is suspended if it has already started. There's clearly no need to handle toggle here, 
 	because there is no focus so the user cannot toggle the mute state :)

Yes, there are tons of different ways you can handle this, specially if you want more power in handling the volume, 
or different toggle for bgm and effects, but it can be a good start for handling the focus/unfocus and mute!

*/

function muteHandleFocus() {
	if (music != null && storageData.muted == false) {
		music.resume()
	}
}

function muteHandleUnfocus() {
	if (music != null) {
		music.suspend()
	}
}

function checkMusicAtStart() {
	if (storageData.muted == true) {
		musicVolume = 0
		zzfxV = musicVolume
		music.suspend()
	}
}

function toggleMute() {
	if (storageData.muted == false) {
		musicVolume = 0
		zzfxV = musicVolume
		storageData.muted = true
		music.suspend()
		saveData()
	} else {
		musicVolume = .2
		zzfxV = musicVolume
		storageData.muted = false
		music.resume()
		saveData()
	}
}


/*
===============================================   FULLSCREEN HANDLER   ===============================================

Oh well the fullscreen part is pretty straightforward, this is a cool toggleFullscreen snipped that
I always use :)

*/

function toggleFullscreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
}


/*
===============================================   AUDIO SECTION   ===============================================

Background music is made with the browser-based music tracker ZzFXM
https://github.com/keithclark/ZzFXM
by Keith Clark
https://twitter.com/keithclarkcouk

and the effects are made with the sound generator/editor ZzFX
https://github.com/KilledByAPixel/ZzFX
made by Frank Force 
https://twitter.com/KilledByAPixel

The sounds in this demo are made specifically for PACKABUNCHAS, 
but you can easily replace them with your own made with ZzFX and ZzFXM!

These tools are really standards for js13kGames imho, you should definitely use them!

*/

//music
music = null
musicVolume = 0.2

function playSound() {
	//PACKABUNCHAS random sound
	if (music != null) {
		zzfx(...[0.2, , 56, .04, .03, .01, , 1.39, 96.9, .2, -114, .16, , , , .1, , .73, .02, .08]);
	}
}

function startMusic() {
	if (music == null) {
		music = zzfxX = new(window.AudioContext || webkitAudioContext);


		//PACKABUNCHAS bgm
		const songData = [
			[
				[.5, 0, 4e3, , , .03, , 1.25, , , , , .02, 6.8, -.3],
				[.5, 0, 8e3, , , .03, 2, 1.25, , , , , .02, 6.8, -.3],
				[.5, 0, 80, , .08, .5, 3]
			],
			[
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , ],
					[2, , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
					[2, , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
					[2, , 21, , , , 21, , , , , , 21, , , , 21, , , , , , , , , , 21, , , , 21, , , , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , ],
					[2, , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
					[2, , 15, , , , 15, , , , , , 15, , , , 15, , , , , , , , , , 15, , , , 15, , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , ],
					[2, , 21, , , , 21, , , , , , 21, , , , 21, , , , , , , , , , 21, , , , 21, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , ],
					[2, , 8, , , , 8, , , , , , 8, , , , 8, , , , , , , , , , 8, , , , 8, , , , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
					[2, , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , ],
					[2, , 29, , , , 29, , , , , , 29, , , , 29, , , , , , , , , , 29, , , , 29, , , , 29, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , ],
					[2, , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
					[2, , 15, , , , 15, , , , , , 15, , , , 15, , , , , , , , , , 15, , , , 15, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
					[2, , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , ],
					[2, , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , , , , , , , , , , , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
					[2, , 14, , , , , , , , , , , , , , , , , , , , , , , , 14, , , , , , , , , , , , , , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
					[2, , 21, , , , , , , , , , , , , , , , , , , , , , , , 21, , , , , , , , , , , , , , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ],
					[2, , , , , , , , , , , , , , , , , , , , , , , , , , 33, , 31, , 29, , , , 31, , , , 24, , , , , , , , , , , , , , , , , , , , 33, , 31, , 29, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , ],
					[2, , 9, , , , , , , , , , , , , , 9, , , , , , , , , , , , , , , , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , , , , , ],
					[2, , 15, , , , , , , , , , , , , , 15, , , , , , , , , , , , , , , , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , , , , , ],
					[2, , 21, , , , , , , , , , , , , , 21, , , , , , , , , , , , , , , , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , , , , , ],
					[2, , 27, , , , 24, , , , , , , , , , , , , , , , , , , , 33, , 32, , 31, , 33, , 29, , , , , , , , , , , , , , , , , , , , 26, , , , 27, , , , 29, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , ],
					[2, , 8, , , , , , , , , , , , , , 8, , , , , , , , , , 8, , , , 8, , , , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , 10, , , , ],
					[2, , 14, , , , , , , , , , , , , , 14, , , , , , , , , , 14, , , , 14, , , , 14, , , , , , , , , , , , , , , , , , , , , , , , 14, , , , 14, , , , ],
					[2, , 29, , , , , , , , , , , , , , 29, , , , , , , , , , 29, , , , 29, , , , 29, , , , , , , , , , , , , , , , , , , , , , , , 19, , , , 19, , , , ],
					[2, , 29, , , , 26, , , , , , , , , , , , , , , , , , , , 29, , 27, , 26, , , , 27, , , , 24, , , , , , , , , , , , , , , , , , , , 24, , 26, , 27, , , , ]
				],
				[
					[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
					[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
					[2, , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , ],
					[2, , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , 10, , , , 9, , , , , , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
					[2, , 15, , , , , , , , , , , , , , , , , , , , , , , , 15, , , , 15, , , , 17, , , , , , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
					[2, , 19, , , , , , , , , , , , , , , , , , , , , , , , 19, , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ],
					[2, , 26, , , , 24, , , , , , , , , , , , , , , , , , , , 27, , , , 27, , , , 26, , , , 24, , , , 22, , , , 24, , , , 22, , , , , , , , 21, , , , , , , , ]
				]
			],
			[4, 5, 6, 7, 0, 1, 2, 3], 120
		]

		const buffer = zzfxM(...songData); // Generate the sample data
		const node = zzfxP(...buffer); // Play the song

		node.loop = true


		checkMusicAtStart()
	}

}

//https://github.com/keithclark/ZzFXM

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx = (...t) => zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP = (...t) => {
	let e = zzfxX.createBufferSource(),
		f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
	t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start();
	return e
}

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG = (q = 1, k = .05, c = 220, e = 0, t = 0, u = .1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => {
	let b = 2 * Math.PI,
		H = v *= 500 * b / zzfxR ** 2,
		I = (0 < x ? 1 : -1) * b / 4,
		D = c *= (1 + 2 * k * Math.random() - k) * b / zzfxR,
		Z = [],
		g = 0,
		E = 0,
		a = 0,
		n = 1,
		J = 0,
		K = 0,
		f = 0,
		p, h;
	e = 99 + zzfxR * e;
	m *= zzfxR;
	t *= zzfxR;
	u *= zzfxR;
	d *= zzfxR;
	z *= 500 * b / zzfxR ** 3;
	x *= b / zzfxR;
	w *= b / zzfxR;
	A *= zzfxR;
	l = zzfxR * l | 0;
	for (h = e + m + t + u + d | 0; a < h; Z[a++] = f) ++K % (100 * G | 0) || (f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g), f = (l ? 1 - C + C * Math.sin(2 * Math.PI * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0), f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f), p = (c += v += z) * Math.sin(E * x - I), g += p - p * B * (1 - 1E9 * (Math.sin(a) + 1) % 2), E += p - p * B * (1 - 1E9 * (Math.sin(a) ** 2 + 1) % 2), n && ++n > A && (c += w, D += w, n = 0), !l || ++J % l || (c = D, v = H, n = n || 1);
	return Z
}

// zzfxV - global volume
zzfxV = musicVolume

// zzfxR - global sample rate
zzfxR = 44100

// zzfxX - the common audio context
//zzfxX = new(window.AudioContext || webkitAudioContext);


/**
 * ZzFX Music Renderer v2.0.3 by Keith Clark and Frank Force
 */

/**
 * @typedef Channel
 * @type {Array.<Number>}
 * @property {Number} 0 - Channel instrument
 * @property {Number} 1 - Channel panning (-1 to +1)
 * @property {Number} 2 - Note
 */

/**
 * @typedef Pattern
 * @type {Array.<Channel>}
 */

/**
 * @typedef Instrument
 * @type {Array.<Number>} ZzFX sound parameters
 */

/**
 * Generate a song
 *
 * @param {Array.<Instrument>} instruments - Array of ZzFX sound paramaters.
 * @param {Array.<Pattern>} patterns - Array of pattern data.
 * @param {Array.<Number>} sequence - Array of pattern indexes.
 * @param {Number} [speed=125] - Playback speed of the song (in BPM).
 * @returns {Array.<Array.<Number>>} Left and right channel sample data.
 */

zzfxM = (instruments, patterns, sequence, BPM = 125) => {
	let instrumentParameters;
	let i;
	let j;
	let k;
	let note;
	let sample;
	let patternChannel;
	let notFirstBeat;
	let stop;
	let instrument;
	let pitch;
	let attenuation;
	let outSampleOffset;
	let isSequenceEnd;
	let sampleOffset = 0;
	let nextSampleOffset;
	let sampleBuffer = [];
	let leftChannelBuffer = [];
	let rightChannelBuffer = [];
	let channelIndex = 0;
	let panning = 0;
	let hasMore = 1;
	let sampleCache = {};
	let beatLength = zzfxR / BPM * 60 >> 2;

	// for each channel in order until there are no more
	for (; hasMore; channelIndex++) {

		// reset current values
		sampleBuffer = [hasMore = notFirstBeat = pitch = outSampleOffset = 0];

		// for each pattern in sequence
		sequence.map((patternIndex, sequenceIndex) => {
			// get pattern for current channel, use empty 1 note pattern if none found
			patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

			// check if there are more channels
			hasMore |= !!patterns[patternIndex][channelIndex];

			// get next offset, use the length of first channel
			nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;
			// for each beat in pattern, plus one extra if end of sequence
			isSequenceEnd = sequenceIndex == sequence.length - 1;
			for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {

				// <channel-note>
				note = patternChannel[i];

				// stop if end, different instrument or new note
				stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
					instrument != (patternChannel[0] || 0) | note | 0;

				// fill buffer with samples for previous beat, most cpu intensive part
				for (j = 0; j < beatLength && notFirstBeat;

					// fade off attenuation at end of beat if stopping note, prevents clicking
					j++ > beatLength - 99 && stop ? attenuation += (attenuation < 1) / 99 : 0
				) {
					// copy sample to stereo buffers with panning
					sample = (1 - attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
					leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
					rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
				}

				// set up for next note
				if (note) {
					// set attenuation
					attenuation = note % 1;
					panning = patternChannel[1] || 0;
					if (note |= 0) {
						// get cached sample
						sampleBuffer = sampleCache[
							[
								instrument = patternChannel[sampleOffset = 0] || 0,
								note
							]
						] = sampleCache[[instrument, note]] || (
							// add sample to cache
							instrumentParameters = [...instruments[instrument]],
							instrumentParameters[2] *= 2 ** ((note - 12) / 12),

							// allow negative values to stop notes
							note > 0 ? zzfxG(...instrumentParameters) : []
						);
					}
				}
			}

			// update the sample offset
			outSampleOffset = nextSampleOffset;
		});
	}

	return [leftChannelBuffer, rightChannelBuffer];
}
