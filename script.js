/*Original code by Bethany Davies as part of CS25320 Assignment 
	 * created 30th November 2017
	 * Updated on the 14th of December
	*/
	
	//main game function (startGame) is called on click of the Start Game Button 
	//On the load of the body the title screen is down - the player is then prompted what to do next 
	
	//Refernce to the canvas variable to create the canvas
	var canv=document.getElementById("myCanvas");
	//Storing the context, to allow drawing on the canvas 
	var ctx=canv.getContext("2d");

	//Global Variables 
	
	//Player positions and dimensions
	var playerX = 480; 
	var playerY = 280; 
	var playerW = 20;
	var playerH = 20; 
	
	//Cells rows, columns and dimensions 
	var cellR = 4;
	var cellC = 7;
	var cellW = 41;
	var cellH = 37; 
	
	//Distance between the cells 
	var cellDistance = 30;
	
	//Distance of cells from 0,0
	var cellTopDistance = 30;
	var cellLeftDistance = 18; 
	
	//Horizontal guard variable
	var guardW = 25;
	var guardH = 25; 
	var gaurdsSpeed = 2;
	
	
	//Variables for game information 
	var infoX = 0;
	var infoY = 275;
	var infoW = 150;
	var infoH = 25;
	
	/*Variable to count lives - player will start with 3 lives 
	 * Will Increse by one when a life is collected 
	 */
	var livesText = 3;
	
	//Variable to count Score - will start at 0
	var score = 0;
	
	//Exit positions and dimentions 
	var exitX = 0;
	var exitY= 0;
	var exitW = 50;
	var exitH = 20;
	
	//Heart picture dimensions and positions
	var lifeW = 35;
	var lifeH = 35;
	
    //Key dimensions
    var keyW = 30;
    var keyH = 35;
    
	//Rock dimensions
	var rockW = 25;
	var rockH = 20;
	
	//Weapon Dimensions 
	var weaponW = 25;
	var weaponH = 25; 
	
	//Pictues used in the game - all referenced in the about page 
	
	//Picture of prison cells
	var cell = new Image();
	cell.src = "Pictures/cell.png";
	
	//Picture of a heart to represent life
	var heart = new Image();
	heart.src = "Pictures/heart.png";
	
    //Picture of the keys that need to be collected
    var key = new Image();
    key.src = "Pictures/key.png";
    
	//Pictures of the rocks that are obstacles in the game 
	var rock = new Image();
	rock.src = "Pictures/rock.png";
	
	//Picture to represent the exit 
	var exit = new Image();
	exit.src = "Pictures/exit.png";
	
	//Picture of the guard 
	var guard = new Image();
	guard.src = "Pictures/guard.png";
	
	//Picture of the player
	var player = new Image();
	player.src = "Pictures/player.png";
	
	//Picture of the weapon
	var weapon = new Image();
	weapon.src = "Pictures/weapon.png";
	
	//Picture for the background of the title and help screen  
	var brick = new Image(); 
	brick.src = "Pictures/brick.jpeg"; 
	
	//Sounds
	
	//Sound for when a key is collected 
	var keySound = new Audio("Sounds/keySound.mp3");
	
	//Sound when player hits guard or cell 
	var hitObject = new Audio("Sounds/lifelost.mp3");
	
	//Sound when player collects a life
	var lifeUp = new Audio("Sounds/lifeUp.mp3");
	
	//Background music 
	var background = new Audio("Sounds/background.mp3");
	

	
	//Originally setting the rock collision to false 
	var rockCollision = false;

	/* A small tutorial was used here for the sprite code 
	 * https://www.simplifiedcoding.net/javascript-sprite-animation-tutorial-html5-canvas/
	 * Also referenced in the about page 
	 */
	
	//Guard Variables for the sprite
	var spriteWidth = 500;
	var spriteHeight = 270;
	var rows = 2;
	var cols = 4;
	var srcX=0;
	var srcY=0;
	var width = spriteWidth/cols;
	var height = spriteHeight/rows;
	var currentFrame = 0;
	var frameCount = 4;
	
	/*Updating the frame so that a different sprite from the sprite sheet gets drawn every frame
	 * To give the character the appearence of movement 
	 */
	function updateFrame(){
		currentFrame = ++currentFrame % frameCount;
		srcX = currentFrame * width; 
	}	
	
	/*A simple tutorial was used for this code however was modied by Bethany Davies
	 *https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
	 * Also referenced in the about page 
	 */
	//2D array to create cells's 
	/*Looping through the array and adding the elemenet to the array everytime
	 *Creating the x and y coordinates to be set later 
	 */
	var cells = [];
	for(var c=0; c<cellC; c++){
		cells[c] = [];
			for(var r=0; r<cellR; r++){
				cells[c][r] = { x: 0, y: 0};
			}
	}
	
	
	/*Arrays for the guards, lives, keys, rocks and weapons
	 *[i][0] is the elements X coordinate
	 *[i][1] is the elements Y coordinate
	 */
	 
	 //[i][2] specifies the original directon for the guard to move in 
	var gaurds = [[150,70,"right"],[0,203,"right"],[205,0,"down"],[345,120,"down"]];
	//[i][2] for lives,keys and weapons specifies if a collision has occured - initially set to "not hit"
	var lives = [[55,97,"not hit"],[160,270,"not hit"],[455,0,"not hit"]];
    var keys = [[235,130,"not hit"],[60,165,"not hit"],[450,65,"not hit"]];
	var weapons = [[275,240,"not hit"],[130,30,"not hit"],[450,135,"not hit"]];
	var rocks = [[135,245],[60,245],[130,0],[25,135],[310,135],[315,275]];
	
    
	//Variables to check key presses 
	var rightPressed = false; 
	var leftPressed = false; 
	var downPressed = false; 
	var upPressed = false; 

	
	//Drawing the player
	function drawPlayer(){
		//Local player variables 
		var playerSpriteW = 500;
		var playerSpriteH = 270;
		var spriteC = 4;
		var spriteR = 2;
		var playerSrcX=0;
		var playerSrcY=0;
		var playerWidth = playerSpriteW/spriteC;
		var playerHeight = playerSpriteH/spriteR;
	
		ctx.drawImage(player,playerSrcX,playerSrcY,playerWidth,playerHeight,playerX,playerY,playerW,playerH);
	}
	
	/*A simple tutorial was used for this code however was modied by Bethany Davies
	 *https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
	 * Also referenced in the about page 
	 */
	function drawCells(){
		//Looping through the rows and columns 
		for(var i=0; i<cellC; i++){
			for(var j=0; j<cellR; j++){
			//Assinging a different location for every cell
			var cellX = ((i*(cellW+cellDistance))+cellLeftDistance);
			var cellY = ((j*(cellH+cellDistance))+cellTopDistance);
			
			//Setting the X and Y position of each cell
			cells[i][j].x =cellX;
			cells[i][j].y = cellY;
			
			//Painting the obstacles on the canvas
			ctx.drawImage(cell,cellX,cellY,cellW,cellH); //Added by Bethany Davies
			
			}
		}
	}
	
	//Function to draw the guards 
	function drawGaurds(){
		for(var i = 0; i < gaurds.length; i++ ){
				//ctx.fillStyle = "#000000";

			ctx.drawImage(guard,srcX,srcY,width,height,gaurds[i][0],gaurds[i][1],guardW,guardH);
	
		}
		updateFrame();
	}

	//Function to allow the guards to move 
	function movementGaurds(){
		for(var i = 0; i < gaurds.length; i++ ){
			if (gaurds[i][2] == "right"){
				gaurds[i][0] = gaurds[i][0] + gaurdsSpeed;
				if (gaurds[i][0] >= 475){
					gaurds[i][2] = "left";
				}
			}else if (gaurds[i][2] == "left"){
				gaurds[i][0] = gaurds[i][0] - gaurdsSpeed;
				if (gaurds[i][0] <= 0){
					gaurds[i][2] = "right";
				}
			}else if (gaurds[i][2] == "down"){
				gaurds[i][1] = gaurds[i][1] + gaurdsSpeed;
				if (gaurds[i][1] >= 275){
					gaurds[i][2] = "up";
				}
			}else if (gaurds[i][2] == "up"){
				gaurds[i][1] = gaurds[i][1] - gaurdsSpeed;
				if (gaurds[i][1] <= 0){
					gaurds[i][2] = "down";
				}
			}
		}
	}
	
	/*Drawing the heart images which represent lives that can be picked up also printing the text of the number of lives 
	 *the player has 
	 */
	function drawLives(){
        //Text for the lives on the game 
		ctx.font ="16px Ariel";
		ctx.fillStyle="#000000";
		ctx.fillText("Lives:  "+livesText,8,290);
        
		//Looping through the array to draw heart images
		for(var  i = 0; i<lives.length; i++){
			if(lives[i][2]=="not hit"){
		      ctx.drawImage(heart,lives[i][0],lives[i][1],lifeW,lifeH);
		    }
		}
	}
    
	//Drawing the keys
    function drawKeys(){
        for(var i=0; i<keys.length; i++){
            if(keys[i][2] == "not hit"){
                ctx.drawImage(key,keys[i][0],keys[i][1],keyW,keyH);
            }
        }
    }
	
	//Drawing the rocks
	function drawRocks(){
		for(var i=0; i<rocks.length; i++){
			ctx.drawImage(rock,rocks[i][0],rocks[i][1],rockW,rockH);
		}
		
	}
	
	//Drawing the weapons 
	function drawWeapons(){
	  for(var i=0; i<weapons.length; i++){
            if(weapons[i][2] == "not hit"){
                ctx.drawImage(weapon,weapons[i][0],weapons[i][1],weaponW,weaponH);
            }
        }
	}
	
	//Drawing the exit
	function drawExit(){
		ctx.fillStyle="#99ddff";
		ctx.drawImage(exit,exitX,exitY,exitW,exitH);
	}
	
	//Registering key presses 
	function keyPressed(e) {
		if (e.keyCode == 39){ 
			rightPressed = true; 
		} 
		else if (e.keyCode == 37){ 
			leftPressed = true; 
		} 
		else if(e.keyCode == 40) { 
			downPressed = true; 
		} 
		else if(e.keyCode == 38){ 
			upPressed = true;  
		} 

	}
	
	//Setting the key presses back to false if they are not being pressed 
	function keyNotPressed(){
		rightPressed = false; 
		leftPressed = false; 
		downPressed = false; 
		upPressed = false; 
		spacePressed = false;
	}
	
	//Drawing the score text
	function drawScore(){
		ctx.font="16px Ariel";
		ctx.fillStyle="#000000";
		ctx.fillText("Score:  "+score,76,290);
	}
	
	//Drawing the title screen for before game play 
	function drawTitleScreen(){
		ctx.drawImage(brick,0,0); 
		//Block one of text 
		//Black border 
		ctx.fillStyle="#000000"; 
		ctx.fillRect(100,25,300,100); 

		//White Box for text to go on  
		ctx.fillStyle="#FFFFFF"; 
		ctx.fillRect(103,28,294,94); 
	
		//Line one of text 
		ctx.font = "40px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("Welcome to",145,65);
	
		//Line two of text  
		ctx.font = "40px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("Merribank Prison",110,110);
	
		//Block two of text  
		//Black border 
		ctx.fillStyle="#000000"; 
		ctx.fillRect(50,150,400,100); 
	
		//White Box for text to go on  
		ctx.fillStyle="#FFFFFF"; 
		ctx.fillRect(53,153,394,94); 
	
		//Line one of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000";
		ctx.fillText("You have been captured by the Merribank guards",54,167); 
	
		//Line two of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("your only hope now is to escape into the nearby forests",54,185);
	
		//Line three of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("before the guards catch you and lock you up for good!",54,200); 
	
		//Line four of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("Are you up for the challenge? ",54,215); 
	
		//Line four of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText("(Hit the help page button for game controls or start )",54,240);
	
	} 
	
	//Drawing the help page for in game help and help just before the game is played
	function helpPage(){ 
		ctx.drawImage(brick,0,0);  
		//Block one of text
		//Black border 
		ctx.fillStyle="#000000"; 
		ctx.fillRect(10,22,475,270); 
	
		//White Box for text to go on  
		ctx.fillStyle="#FFFFFF"; 
		ctx.fillRect(15,27,465,260); 
	
		//Line one of text  
		ctx.font = "30px Ariel";
		ctx.fillStyle="#000000"; 
		ctx.fillText("Game Rules",20,55); 
	
		//Line one of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - You must get to the exit at the top left of the screen",20,80); 
	
		//Line two of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - If you cross paths with a guard or alert one of the prisoners by ",20,100); 
	
		//Line three of text  
		ctx.font = "16px Ariel";
		ctx.fillStyle="#000000"; 
		ctx.fillText("touching a jail cell, you will lose a life and return to the start",40,120); 
	
		//Line four of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - You must collect three weapons and three keys in order to escape",20,140); 
	
		//Line four of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000";
		ctx.fillText("(Hit the start game button below to begin)",20,280); 
	
		//Line one of text  
		ctx.font = "30px Ariel";
		ctx.fillStyle="#000000";
		ctx.fillText("Game Controls",20,170); 
	
		//Line four of text 
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - Right Arrow - Move right",20,190);
	
		//Line four of text  
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - Left Arrow - Move Left ",20,210);
	
		//Line four of text 
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - Up Arrow - Move Up ",20,230) 
	
		ctx.font = "16px Ariel"; 
		ctx.fillStyle="#000000"; 
		ctx.fillText(" - Down Arrow - Move Down",20,250)
	}
	
	//Function to initiate game over
	function gameOver(){
		if(livesText == 0 ){
			alert("Game Over, you've been found by the guards! \nHint: Next time make sure you don't collide with the guards or the cells");
			document.location.reload();
		}
	}
	
	// Function to draw the current game information 
	function drawGameInfo(){
		ctx.fillStyle="#A9A9A9";
		ctx.fillRect(infoX,infoY,infoW,infoH);
	}
	
	/*A small tutorial was used for this code howver it was modified by Bethany Davies
	 *https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
	 * Also referenced in the about page 
	 */
	function cellCollisionDetection(){
		for(var i=0; i<cellC; i++){
			for(var j=0; j<cellR; j++){
				var b = cells[i][j];
				if((playerX + playerW> b.x) && (playerX < b.x + cellW) && (playerY +
				playerH > b.y) && (playerY < b.y + cellH)){
				//Resetting player back to the start if they hit an cell
				playerX = 480; //Added by Bethany Davies
				playerY = 280; //Added by Bethany Davies
				livesText--; //Added by Bethany Davies
				hitObject.play(); //Added by Bethany Davies

				
				}
			}
		}
	}
	
	//A function to dectect if guards collide with the player
	function guardCollisionDetection(){
		for(var i = 0; i < gaurds.length; i++){
			if((playerX + playerW> gaurds[i][0]) && (playerX < gaurds[i][0]+ guardW) && (playerY +
				playerH > gaurds[i][1]) && (playerY < gaurds[i][1]+guardH)){
				//Resetting player back to the start if they hit a guard
				playerX = 480;
				playerY = 280;
				hitObject.play();
				
			}
		}
	}
	
	//A function to check is the player collides with the lives
	function lifeCollisionDetection(){
		for(var i=0; i<lives.length; i++){
			if((playerX + playerW > lives[i][0]) &&( playerX < lives[i][0]+ lifeW) && (playerY < lives[i][1]
			+ lifeH) && (playerY + playerH > lives[i][1]) && (lives[i][2] == "not hit") ){
			lives[i][2] = "hit";
			livesText++;
			lifeUp.play();
			}
		}
	
	}
	
	//A function to check is the player collides with the key
	function keyCollisionDetection(){
        for(var i=0; i<keys.length; i++){
            if((playerX + playerW > keys[i][0]) && (playerX < keys[i][0]+ keyW) && (playerY < keys[i][1]
			+ keyH )&& (playerY + playerH > keys[i][1]) && (keys[i][2] == "not hit")){
                keys[i][2] = "hit";
                score++;
				keySound.play();
            }
        }
    }
	
	//A function to check is the player collides with the exit
	function exitCollision(){ 
        if((playerX < exitX + exitW) && (playerY < exitY + exitH) && score < 6){
			playerX=55;
            playerY=0;
			//Giving the player a hint on how to complete the game 
            alert("Not enough keys, go back!\nHint: You must collect all three keys and three weapons to complete the game");
			leftPressed = false;
            //document.reload();
        }else if((playerX < exitX + exitW) && (playerY < exitY + exitH) && score==6){
			alert("You win!");
			document.location.reload();
		
		}

    }
	
	//Making it so the player cannot go through the game info box
	function gameInfoCollisionDetection(){
		if((playerX + playerW > infoX) && (playerX < infoX + infoW) && 
			(playerY < infoY + infoH)&& (playerY+playerH > infoY)){
			leftPressed= false;
			playerX = 151;
			playerY = 280;
		}
	}
	
	//A function to check is the player collides with a rock
	function rockCollisionDetection(){
		for(var i=0; i<rocks.length; i++){
			if((playerX + playerW > rocks[i][0]) && (playerX < rocks[i][0]+ rockW) && (playerY < rocks[i][1]
				+ rockH) && (playerY + playerH > rocks[i][1])){
				rockCollision = true;
			}
		}
	}
	
	//A function to check is the player collides with a weapon
	function weaponCollisionDetection(){
	  for(var i=0; i<weapons.length; i++){
            if((playerX + playerW > weapons[i][0]) && (playerX < weapons[i][0]+ weaponW) && (playerY < weapons[i][1]
			+ weaponH )&& (playerY + playerH > weapons[i][1]) && (weapons[i][2] == "not hit")){
                weapons[i][2] = "hit";
                score++;
				keySound.play();
            }
        }
	}

	
	//Function to get input from the keyboard so the user can move
	function getInput(){ 
	
		//Ensuring that the player has not collided with a rock before the player is allowed to move 
		if(rockCollision == false){
			//Moving the player in the direction that the player has chosen - while ensuring they can't move off the canvas 
			if((rightPressed == true) && (playerX < canv.width - playerW)){
				playerX +=2;
			}
			
			if ((leftPressed == true) && (playerX > 0 )){
				playerX -= 2;
				
			}
			if ((downPressed == true) && (playerY < canv.height - playerH )){
				playerY += 2;
			}
	
			if ((upPressed == true) && (playerY > 0) ){
				playerY -=2;
			}
		} else{
			//If the player has collided with a rock then the player is bounced back in the opposite direction 
			if (leftPressed == true){
				playerX +=6;	
				leftPressed = false; 
		
			} else if (rightPressed == true){
				playerX -=6;
				rightPressed = false; 
		
			} else if (upPressed == true){
				playerY +=6;
				upPressed = false; 
		
			} else if (downPressed == true){
				playerY -=6;
				downPressed = false; 
		
			}	
		
	
		rockCollision = false;
		
		}

	 } 

	function updateWorld(){
		//detecting any collision detections 
		cellCollisionDetection();
		movementGaurds();
		guardCollisionDetection(); 
		lifeCollisionDetection(); 
        keyCollisionDetection();
		gameInfoCollisionDetection();
		rockCollisionDetection();
		weaponCollisionDetection();
		exitCollision();
		//Initiating game over 
		gameOver(); 
	}
	
	function drawEverything(){ 
		//Clearing the canvas every frame
		ctx.clearRect(0,0,canv.width,canv.height); 
		//Drawing everything 
		drawPlayer();
		drawGaurds();
		drawCells();
		drawGameInfo();
		drawLives();
        drawKeys();
		drawScore();
		drawRocks();
		drawWeapons();
		drawExit();
	
	
		
	 } 
	
	function gameLoop(){ 
		//Getting player input
		getInput();
		//Updating the game when something happens 
		updateWorld();
		//Drawing all the elements of the game 
		drawEverything(); 
		//Recurrsively calling the game loop in request animation frame 
		window.requestAnimationFrame(gameLoop); 
		
		//Playing background music
		 background.play();
		
	 } 

	function startGame(){
	
		// Litening to see if a key has been pressed / not pressed 
		window.addEventListener("keydown",keyPressed); 
		window.addEventListener("keyup",keyNotPressed);
		
		// Disabling the Buttons once the game has started 
		document.getElementById("start").disabled = true;
		document.getElementById("help").disabled = true; 
		
		//Calling game loop within request animation frame
		window.requestAnimationFrame(gameLoop);
		
	}
