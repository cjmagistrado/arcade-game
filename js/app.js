
/* There are three states of the game, start, select, and gameover.
 * The state variable lets us know where we are and when to use certain functions.
 */
var state = "start";
	
/* The character index starts at the very beginning of the character array.
 * The properties of characters are name and image.
 */
var characterIndex = 0,
    characters = [{ name : "Ren", image : "images/char-ren.png" },
    { name : "Selma", image : "images/char-selma.png" },
    { name : "Kyla", image : "images/char-kyla.png" },
    { name : "Elysia", image : "images/char-elysia.png" },
    { name : "Starla", image : "images/char-starla.png" }];

/* A variable used for locking users keyboard input
 */				  
var playerLock = false;
				  
/* This plays the sound from the soundCache in resources.js
 * If a sound is already playing, it will stop the current sound of the same and play
 * a new one from the beginning.
 */
var playSound = function(url) {
	
	function isPlaying(sound) {
		return !sound.paused;
	}
	
	var sound = Sounds.get(url);
	
	if (isPlaying(sound)) {
		sound.pause();
		sound.currentTime = 0;
	}
	sound.play();
}

/* This is the Player class. It has a sprite and has a frameIndex that stays at 0.
 * At random ticks, the character blinks setting the frameIndex to 1 for a moment and then sets
 * it back at 0.
 */
var Player = function(x, y) {
	
	this.x = x;
	this.y = y;
	this.width = 303;
	this.height = 171;
	this.sprite = 'images/char-ren.png';
	this.frameIndex = 0;
	this.stepCount = 0;
	this.stepsPerBlink = 20;
	this.numberOfFrames = 3;
	this.selectMode = function() {
		this.x = 202;
		this.y = 235;
	};
	this.changePlayer = function(img) {
		this.sprite = img;
	};
	this.life = 3;
	this.blinkAble = true;
	this.hurt = function() {
		
		/* Lock user input */
		playerLock = true;
		
		playSound('sounds/ow.mp3');
		
		var self = this;
		this.frameIndex = 2;
		
		/* When collided with an enemy, the player flashes from frameIndex 0
		 * to frameIndex 2, frameIndex 2 having a blank state of the player's sprite.
		 */
		setTimeout(function() {
			
			self.blinkAble = false;
			self.frameIndex = 0;
			setTimeout(function() {
				
				self.frameIndex = 2;
				setTimeout(function() {
					
					self.frameIndex = 0;
					setTimeout(function() {
						
						self.frameIndex = 2;
						setTimeout(function() {
							
							self.frameIndex = 0;
							self.blinkAble = true;
							
							setTimeout(function() {
								
								/* Unlock user input */
								playerLock = false;
								
							}, 700);
						}, 100);
					}, 100);
				}, 100);
			}, 100);
		}, 100);
		
		/* When hit by an enemy, the player loses a life then resets the
		 * player at the starting position. The frameIndex of the objects heart1, heart2, and heart3
		 * are set to 1 each one by one. The specified object in the life array turns the image of a red
		 * heart to a gray one.
		 */
		var lifeIndex = this.life - 1;
		life[lifeIndex].frameIndex = 1;
		this.life -= 1;
		this.reset();
		
		/* If the player doesn't have a life left, the player and score is hidden then 
		 * brings up the gameover screen. The final score is set to gameOverText and displays.
		 */
		if (lifeIndex === 0) {
			state = "gameover";
			this.hide();
			score.hide();
			uiGameOver.moveToPos(84, 195);
			gameOverText.displayText(score.current.toString());
			gameOverText.show(250, 320);
		}
	};
	this.hide = function() {
		this.x = -100;
		this.y = 0;
	};
	this.reset = function() {
		this.x = 202;
		this.y = 390;
	};
};

Player.prototype.render = function() {
		
	ctx.drawImage(Resources.get(this.sprite), this.frameIndex * this.width / this.numberOfFrames, 0, this.width / this.numberOfFrames, this.height, this.x, this.y, this.width / this.numberOfFrames, this.height);
};

/* Player updates */
Player.prototype.update = function(dt) {
	
	this.stepCount += 10 * dt;
	
	/* At a certain step(tick), it decides whether the player blinks or not. */
	if (this.stepCount > this.stepsPerBlink) {
			
		var self = this;
		var rand = Math.floor((Math.random() * 100) + 1);
		
		if (rand > 70) {
		
			if (this.blinkAble === true) {
				this.frameIndex = 1;
				setTimeout(function() {
					self.frameIndex = 0;
				}, 150);
				this.stepCount = 0;
			}
		}
	}
	
	/* When Player touches the star, a sound will play, adds 1 point to the score,
	 * generates/regenerates the position of the gems and resets position of the player.
	 */
	if (this.x == star.x && this.y < star.y) {
		
		playSound('sounds/star.mp3');
		score.add(1);
		gemSpawner.generate();
		player.reset();
	}
}

/* The UI of the game. */
var ui = function(url, x, y) {
	this.x = x;
	this.y = y;
	this.width = 344;
	this.height = 392;
	this.sprite = url;
	this.frameIndex = 0;
	this.stepCount = 0;
	this.numberOfFrames = 1;
	this.render = function() {
		
		ctx.drawImage(Resources.get(url), this.x, this.y);
	}
	this.changeDisplay = function(url, x, y) {	
		this.sprite = url;
		this.x = x;
		this.y = y;
	};
	this.moveToPos = function(x, y) {
		this.x = x;
		this.y = y;
	}
};

/* This displays the names of the characters while on the select player screen. */
var uiCharacterSelectText = function(text) {
	this.x = -100;
	this.y = 0;
	this.width = 188;
	this.height = 34;
	this.text = text;
	this.render = function() {
		
		ctx.font = '18pt Calibri';
		ctx.textAlign = "center"; 
		ctx.strokeStyle = 'black';
   		ctx.fillStyle = '#ffc200';
    	ctx.fillText(this.text, this.x, this.y);
	}
}

uiCharacterSelectText.prototype.displayText = function(text) {
	this.text = text;
};

uiCharacterSelectText.prototype.show = function(x, y) {
	this.x = x;
	this.y = y;
};

uiCharacterSelectText.prototype.hide = function() {
	this.x = -100;
	this.y = 0;
}

/* This displays the text of the final score of the player. */
var uiGameOverText = function(text) {
	this.x = -200;
	this.y = 0;
	this.width = 188;
	this.height = 34;
	this.render = function() {
		
		ctx.font = 'bold 25pt Calibri';
		ctx.textAlign = "center"; 
		ctx.strokeStyle = 'black';
   		ctx.fillStyle = '#ffc200';
    	ctx.fillText(this.text, this.x, this.y);
	}
	this.hide = function() {
		this.x = -100;
		this.y = 0;
	}
}

uiGameOverText.prototype = Object.create(uiCharacterSelectText.prototype);

/* Holds the sprites of left and right arrows while on select player screen. */
var uiCharacterSelectArrow = function(url) {
	
	this.x = -100;
	this.y = 0;
	this.width = 188;
	this.height = 34;
	this.frameIndex = 0;
	this.stepCount = 0;
	this.stepsPerFrame = 2;
	this.numberOfFrames = 4;
	this.sprite = url;
	this.show = function(x, y) {
		this.x = x;
		this.y = y;
	};
	this.hide = function() {
		this.x = -100;
		this.y = 0;
	}
}

uiCharacterSelectArrow.prototype = Object.create(Player.prototype);
uiCharacterSelectArrow.prototype.update = function(dt) {
	
	/* Animate arrows */
	this.stepCount += 10 * dt;
	
	if (this.stepCount > this.stepsPerFrame) {
			
		if (this.frameIndex < this.numberOfFrames - 1) {
				
			this.frameIndex++;
				
		}else{
				
			this.frameIndex = 0;
		}
		
		this.stepCount = 0;
	}
}

/* This the Heart class with a sprite. */
var Heart = function(x, y) {
	
	this.x = x;
	this.y = y;
	this.width = 82;
	this.height = 39;
	this.sprite = 'images/heart.png';
	this.frameIndex = 0;
	this.stepCount = 0;
	this.numberOfFrames = 2;
	this.show = function(x, y) {
		
		this.y = y;
		this.x = x;
	};
	this.hide = function() {
		
		this.x = -100;
		this.y = 0;
	};
	this.reset = function() {
		this.frameIndex = 0;
	}
}

Heart.prototype = Object.create(Player.prototype);

/* Keyboard Inputs */
Player.prototype.handleInput = function(e) {
	
	switch (e) {
		
		case 'right':
		
			if (state === "select") {
				
				characterIndex++;
				
				if (characterIndex > characters.length - 1) {
					characterIndex = characters.length - 1;
				}
				
				if (characterIndex > 0) {
					characterSelectLeft.show(163, 320);
				}

				if (characterIndex === characters.length - 1) {
					characterSelectRight.hide(163, 320);
				}
				
				characterSelectText.displayText(characters[characterIndex].name);
				player.changePlayer(characters[characterIndex].image);
				
			}else if (state === "playing" && playerLock === false) {
				if (this.x !== 404) {
					this.x += 101;
				}
			}
			
			break;
		
		case 'up':
		
			if (state === "playing" && playerLock === false) {
				if (this.y !== 50) {
					this.y -= 85;
				}
			}
			break;
			
		case 'left':
		
			if (state === "select") {
				
				characterIndex--;
				
				if (characterIndex < 0) {
					characterIndex = 0;
					
				}else{
					
					characterSelectRight.show(295, 320);
				}
				
				if (characterIndex === 0) {
					characterSelectLeft.hide();
				}
				
				characterSelectText.displayText(characters[characterIndex].name);
				player.changePlayer(characters[characterIndex].image);
				
			}else if (state === "playing" && playerLock === false) {
				if (this.x !== 0) {
					this.x -= 101;
				}
			}
			break;
		
		case 'down':
			
			if (state === "playing" && playerLock === false) {
				if (this.y !== 390) {
					this.y += 85;
				}
			}
			break;
			
		case 'space':
		
			if (state === "start") {
				
				uiStart.moveToPos(-400, 125);
				uiSelect.moveToPos(84, 155);
				player.selectMode();
				characterSelectText.show(254, 270);
				characterSelectRight.show(295, 320);
				state = "select";
				
			}else if (state === "select") {
				
				player.reset();
				characterSelectText.hide();
				characterSelectLeft.hide();
				characterSelectRight.hide();
				uiSelect.moveToPos(-400, 125);
				heart1.show(15, 530);
				heart2.show(55, 530);
				heart3.show(95, 530);
				star.show(202, 95);
				score.show(490, 90);
				gemSpawner.generate();
				state = "playing";
				
			}else if (state === "gameover") {
				
				uiStart.moveToPos(84, 125);
				uiGameOver.moveToPos(-400, 125);
				characterIndex = 0;
				characterSelectText.displayText(characters[0].name);
				player.changePlayer(characters[0].image);
				gem1.hide();
				gem2.hide();
				gem3.hide();
				heart1.hide();
				heart2.hide();
				heart3.hide();
				heart1.reset();
				heart2.reset();
				heart3.reset();
				player.life = 3;
				star.hide();
				score.current = 0;
				gameOverText.hide();
				state = "start";
			}
			
			break;
	}
};

/* Player's score keeper and displayer. */
var Score = function(x, y) {
	
	this.x = x;
	this.y = y;
	this.current = 0;
	this.render = function() {
		
		ctx.font = '30pt Calibri';
		ctx.textAlign="right"; 
		ctx.strokeStyle = 'black';
    	ctx.fillStyle = 'white';
    	ctx.fillText(this.current, this.x, this.y);
	}
	this.add = function(points) {
		
		var score = this.current;
		this.current = score + points;
	}
	this.show = function(x, y) {
		
		this.x = x;
		this.y = y;
	}
	this.hide = function() {
		
		this.x = -100;
		this.y = 0;
	}
};

/* Star includes sprite */
var Star = function(x, y) {
	
	this.x = x;
	this.y = y;
	this.width = 540;
	this.height = 120;
	this.sprite = 'images/star.png';
	this.frameIndex = 0;
	this.stepCount = 0;
	this.stepsPerFrame = 1;
	this.numberOfFrames = 5;
	this.show = function(x, y) {
		this.x = x;
		this.y = y;
	}
	this.hide = function() {
		this.x = -100;
		this.y = 0;
	}
};

Star.prototype = Object.create(Player.prototype);
Star.prototype.update = function(dt) {
	
	/* Animates the star */
	this.stepCount += 10 * dt;
	
	if (this.stepCount > this.stepsPerFrame) {
			
		if (this.frameIndex < this.numberOfFrames - 1) {
			
			this.frameIndex++;
			
		}else{
				
			this.frameIndex = 0;
		}
		
		this.stepCount = 0;
	}
}

/* This is the enemy class that contains a sprite */
var Enemy = function() {

	this.x = -100;
	this.y = 300;
	this.speed = 150;
	this.width = 101;
	this.height = 88;
    this.sprite = 'images/enemy-bug.png';
	this.frameIndex = 0;
	this.stepCount = 0;
	this.stepsPerFrame = 1;
	this.numberOfFrames = 1;
	this.movable = false;
	this.move = function() {
		this.movable = true;
	}
	this.stop = function() {
		this.movable = false;
	}
};

Enemy.prototype = Object.create(Player.prototype);
Enemy.prototype.update = function(dt) {
	
	/* If this enemy collides with player */
	if (state === "playing") {
	
		if (this.x < player.x + player.width - 252 && this.x + this.width > player.x + 10 &&
			this.y < player.y + 80 + this.height - 10 && this.y + this.height - 10 > player.y + 80) {
		
			player.reset();
			player.hurt();
		}
	}
	
	/* If variable movable is set to true, move
	 * enemy by the speed times delta time.
	 */
	if (this.movable === true) {
		
		this.x += this.speed * dt;
	}
	
	// If finished crossing
	if (this.x > 510) {
		
		this.stop();
		this.x = -100;
		enemies.push(this);
	}
};

/* Manages enemy objects' starting positions. After enemy object crosses the screen,
 * move enemy to random specified y positions. Randomly cuts at times to give player space to
 * go through to.
 */ 
var EnemyGenerator = function() {
	
	this.startY = [378, 295, 212],
	this.stepCount = 0,
	this.stepsPerSet = 8;
	this.update = function(dt) {
		
		this.stepCount += 10 * dt
			
		if (this.stepCount > this.stepsPerSet) {

			var rand = Math.floor((Math.random() * 100) + 1);
			
			if (rand > 10){
			
				if (enemies.length !== 0) {
				
					var randStartY = Math.floor((Math.random() * 3) + 1) - 1;
					enemies[0].y = this.startY[randStartY];
					enemies[0].move();
					enemies.splice(0, 1);
				}
			}

			this.stepCount = 0;
		}
	}
};

/* Gem class with a sprite */
var Gem = function(x, y) {
	
	this.x = x;
	this.y = y;
	this.width = 280;
	this.height = 28;
	this.sprite = 'images/gem.png';
	this.frameIndex = 0;
	this.stepCount = 0;
	this.stepsPerFrame= 1;
	this.numberOfFrames = 10;
	this.set = function(x, y) {
		
		this.x = x;
		this.y = y;
	}
	this.hide = function() {
		this.x = -100;
		this.y = 0;
	}
}

Gem.prototype = Object.create(Player.prototype);
Gem.prototype.update = function(dt) {
	
	/* Animate this gem */
	this.stepCount += 10 * dt;
	
	if (this.stepCount > this.stepsPerFrame) {
			
		if (this.frameIndex < this.numberOfFrames - 1) {
				
			this.frameIndex++;
				
		}else{
				
			this.frameIndex = 0;
		}
		
		this.stepCount = 0;
	}
	
	/* When player touches this gem, play a sound, add 5 points to the score, and move this
	 * gem out of the screen.
	 */
	if (this.x < player.x + player.width - 202 && this.x + this.width - 252 > player.x &&
		this.y - 100 < player.y + this.height && this.y - 50 + this.height > player.y) {
		
		playSound('sounds/gem.mp3');
		score.add(5);
		this.set(-100, 325);	
	}
}

/* Decides where each gem goes and wether it should be placed or not */
var GemGenerator = function() {
	
	/* These are all the positions of the gems */
	this.positions = [{ x : 37,  y : 242},
				      { x : 138, y : 242},
				      { x : 239, y : 242},
					  { x : 340, y : 242},
					  { x : 441, y : 242},
					  { x : 37,  y : 325},
					  { x : 138, y : 325},
					  { x : 239, y : 325},
					  { x : 340, y : 325},
					  { x : 441, y : 325},
					  { x : 37,  y : 408},
					  { x : 138, y : 408},
					  { x : 239, y : 408},
					  { x : 340, y : 408},
					  { x : 441, y : 408}];
					  
	this.generate = function() {
		
		/* Index of positions */
		var gemPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
		/* When position is picked, it will be pushed to this array. */
	    var gemPosArray = [];
		
		/* Reset each gem and place them out of the screen */
        gems.forEach(function(gem) {
        	gem.set(-100, 325);
        });
		
		function randomizePos() {
			
			/* Picks a position randomly */
			var randPos = Math.floor((Math.random() * gemPositions.length) + 0),
			positionSet = gemPositions[randPos];
			
			/* Checks if gemPosArray already has this position. This will lessen the chances that
			 * more than one gem is placed on the same position.
			 */
			var checkPos = gemPosArray.lastIndexOf(positionSet);
			if (checkPos > -1) {
				
				/* If gemPosArray already has this position, re-pick position again. */
				return randomizePos();
				
			}else{
			
				/* If gemPosArray doesn't already have this position, push this position to it. */
				gemPosArray.push(positionSet);
				
				/* Output position */
				return positionSet;
			}
		}
		
		for (gem in gems) {
			
			var pos = randomizePos();
			
			/* Delete this position from gemPositions array. */			
			gemPositions.splice(pos, 1);
			
			/* Place this gem or not. */
			var randSet = Math.floor((Math.random() * 2) + 0);
				
			if (randSet === 1) {
			
				gems[gem].x = this.positions[pos].x;
				gems[gem].y = this.positions[pos].y;
			}
		}
		
		/* Clear gemPosArray */
		gemPosArray.length = 0;
	}
}
/* Keyboard inputs */
document.addEventListener('keydown', function(e) {
	
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
		32: 'space',
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
/* Declare variables */
var uiStart = new ui('images/ui/start.png', 84, 125),
	uiSelect = new ui('images/ui/select-character.png', -400, 125),
	uiGameOver = new ui('images/ui/gameover.png', -400, 125),
	characterSelectText = new uiCharacterSelectText(characters[0].name),
	characterSelectLeft = new uiCharacterSelectArrow('images/ui/select-left.png'),
	characterSelectRight = new uiCharacterSelectArrow('images/ui/select-right.png'),
	gameOverText = new uiGameOverText(0),
	player = new Player(-200, 125),
	star = new Star(-100, 125),
	score = new Score(-100, 125),
	heart1 = new Heart(-100, 125),
	heart2 = new Heart(-100, 125),
	heart3 = new Heart(-100, 125),
	enemySpawner = new EnemyGenerator(),
	gemSpawner = new GemGenerator();
	gem1 = new Gem(-100, 325),
	gem2 = new Gem(-100, 325),
	gem3 = new Gem(-100, 325);
	
var bug1 = new Enemy(),
	bug2 = new Enemy(),
	bug3 = new Enemy(),
	bug4 = new Enemy(),
	bug5 = new Enemy(),
	bug6 = new Enemy();
	
var allEnemies = [bug1, bug2, bug3, bug4, bug5, bug6],
	enemies = [bug1, bug2, bug3, bug4, bug5, bug6],
	gems = [gem1, gem2, gem3],
	life = [heart1, heart2, heart3];
