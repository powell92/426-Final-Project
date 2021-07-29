// API 1 (Bitcoin price)
function bitcoin() {
    fetch("https://api.coindesk.com/v1/bpi/currentprice.json")  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        drawCoin(data);
    })
    .catch(function() {
        //catch errors
    });
}

function drawCoin(data) {
    let coin_price = data["bpi"]["USD"]["rate"]
    let $text = $("#btcprice");
    $text.empty();
    $text.append(`<p><strong class="subtitle is-5 has-text-primary">Current Bitcoin price (because it's going to the moon?):</strong> <strong><i class="has-text-success">$${coin_price}</i></strong></p>`);
}
// END API 1

// API 2 (Joke of the day)
function joke() {
    fetch("https://geek-jokes.sameerkumar.website/api?format=json")  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        drawJoke(data);
    })
    .catch(function() {
        //catch errors
    });
}

function drawJoke(data) {
    let joke = data["joke"]
    let $text = $("#jotd");
    $text.empty();
    $text.append(`<p><strong class="subtitle is-5 has-text-primary">Here's a joke:</strong></p>`);
    $text.append(`<p><strong class="has-text-success">${joke}</strong></p>`);
}
// END API 2


// API 3 (Space news)
function news() {
    fetch("https://spaceflightnewsapi.net/api/v2/articles")  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        getNews(data);
    })
    .catch(function() {
        //catch errors
    });
}

function getNews(data) {
    let $text = $("#headlines");
	let sourceFix = 10; 		//fix for filtering out propaganda
    $text.empty();
    $text.append(`<p class="subtitle is-5 has-text-primary">Top Space Headlines:</p>`);

	for (let i=0; i<sourceFix; i++) {
		let title = data[i]["title"];
		let link = data[i]["url"];
		let source = data[i]["newsSite"];
		if (!source.includes("Fox")) {		
			$text.append(`<p><a href="${link}"><i><strong>${title} - ${source}</strong></i></a></p>`);
		} else {
			sourceFix++;
		}
	}
}
//API Key = 2fc47e19105a4efa9cf5b00bf9630a57
//news api = https://newsapi.org/v2/top-headlines?country=us&apiKey=2fc47e19105a4efa9cf5b00bf9630a57
// END API 3


// API 4 (Upcoming Launches)
function launches() {
    fetch("https://spacelaunchnow.me/api/ll/2.2.0/launch/upcoming/?format=json")  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        getLaunches(data);
    })
    .catch(function() {
        //catch errors
    });
}

function getLaunches(data) {
	let launchCount = 9;
    let $text = $('#launches');
    //$text.empty();

	for (let j=0; j<launchCount; j++) {
		let info = data["results"][j];	//shorten the following calls
		let launchName = info["name"];	//launch name
		let launchStatus = info["status"]["name"];	//status
		let launchStatusDescription = info["status"]["description"];	//status reasoning
		let launchWindowStart = info["window_start"];	//when launch window opens
		let launchServiceProvider = info["launch_service_provider"]["name"];		//name of launch service provider
		let rocketConfig = info["rocket"]["configuration"]["name"];	//rocket: configuration: name
		let missionName = info["mission"]["name"];	//mission: name
		//let missionDescription = info["mission"]["description"]		//mission description
		let missionType = info["mission"]["type"];	//mission type
		let missionOrbit = info["mission"]["orbit"]["name"];	//mission orbit
		let missionImage = info["image"];	//mission image

		$text.append(`	<div class="column is-4 flexy">
			  				<div class="card large">
								<div class="card-image">
				  					<figure class="image is-16by9">
										<img src="${missionImage}">
				  					</figure>
								</div>
								<div class="card-content has-text-success">
				  					<div class="media">
										<div class="media-content">
											<p class="title is-5 no-padding has-text-primary">${launchName}</p>
											<p class="is-6">Status: ${launchStatus}</p>
											<p class="is-6">${launchStatusDescription}</p>
											<p class="is-6">Launch window opens: ${launchWindowStart}</p>
											<p class="is-6">Launch Service Provider: ${launchServiceProvider}</p>
											<p class="is-6">Rocket: ${rocketConfig}</p>
											<p class="is-6">Mission: ${missionName}</p>
											<p class="is-6">Mission Type: ${missionType}</p>
											<p class="is-6">Orbit: ${missionOrbit}</p>
										</div>
			  						</div>
								</div>
							</div>
						</div>
		`);		
	}
}
// END API 4

// API 5 (space background of the day)
function spaceBG() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=WYd12WefUXhP97s56KtQTL9eNIs3yeJBPunCAag6")  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        getSpace(data);
    })
    .catch(function() {
        // catch errors
    });
}

function getSpace(data) {
    let bgImage = data["url"]
	document.body.style.backgroundImage = "url('"+bgImage+"')";
}
// API Key = WYd12WefUXhP97s56KtQTL9eNIs3yeJBPunCAag6
// END API 5

// ********************END APIs

let canvas = document.getElementById("the-game");
let context = canvas.getContext("2d");
let game, snake, food;

spaceBG();
bitcoin();
joke();
news();
launches();

game = {
	score: 0,
	fps: 8,
	over: false,
	message: null, // sentinel
  
	start: function() {		//start game
		game.over = false;
		game.message = null;
		game.score = 0;
		game.fps = 8;
		snake.init();
		food.set();
	},
  
	stop: function() {		//end game
		game.over = true;
    	game.message = "GAME OVER";
	},
  
	drawBox: function(x, y, size, color) {		//draw box to work in
    	context.fillStyle = color;
    	context.beginPath();
    	context.moveTo(x - (size / 2), y - (size / 2));
    	context.lineTo(x + (size / 2), y - (size / 2));
    	context.lineTo(x + (size / 2), y + (size / 2));
    	context.lineTo(x - (size / 2), y + (size / 2));
    	context.closePath();
    	context.fill();
	},
  
	drawScore: function() {		//display score in background
    	context.fillStyle = "#1C1C1C";
    	context.font = (canvas.height) + "px Impact, sans-serif";
    	context.textAlign = "center";
    	context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
	},
  
	drawMessage: function() {		//since there is no "winning" this is a "game over" message
    	if (game.message !== null) {
    		context.fillStyle = "#23d160";
    		context.strokeStyle = "#1C1C1C";
    		context.font = (canvas.height / 10) + "px Arial";
    		context.textAlign = "center";
    		context.fillText(game.message, canvas.width / 2, canvas.height / 2.1);
			context.fillText("Press Q to continue", canvas.width / 2, canvas.height / 1.5); //have to make a new line because canvas can"t handle \n
    	}
	},
  
	resetCanvas: function() {	//reset canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
};

snake = {
	size: canvas.width / 40,
	x: null,
	y: null,
	color: "#23D160",
	direction: "left",	//have to initialize direction
	sections: [],
  
	init: function() {	//initialize the snake
    	snake.sections = [];	//to track sections
    	snake.direction = "left";	//starting direction
    	snake.x = canvas.width / 2 + snake.size / 2;	//draw the snake 
    	snake.y = canvas.height / 2 + snake.size / 2;
    	for (let i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) {	//mystery code because im a moron that doesnt document stuff as he writes it
    		snake.sections.push(i + "," + snake.y); 	//pretty sure im adding sections to the snake as it eats
    	}
	},
  
	move: function() {
    	switch (snake.direction) {
    		case "up":
        		snake.y -= snake.size;
        		break;
    		case "down":
        		snake.y += snake.size;
        		break;
    		case "left":
        		snake.x -= snake.size;
        		break;
    		case "right":
        		snake.x += snake.size;
        		break;
    	}
    	snake.checkCollision();
    	snake.checkGrowth();
    	snake.sections.push(snake.x + "," + snake.y);	//update sections[]
	},
  
	draw: function() {
    	for (let i = 0; i < snake.sections.length; i++) {	//counts sections in array
    		snake.drawSection(snake.sections[i].split(","));
    	}    
	},
  
  	drawSection: function(section) {
    	game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);	//draw the snake
	},
  
	checkCollision: function() {	//for stopping game when there is a collision
    	if (snake.isCollision(snake.x, snake.y) === true) {
      		game.stop();
    	}
  	},
  
	isCollision: function(x, y) {	//checking for a collision
    	if (x < snake.size / 2 || x > canvas.width || y < snake.size / 2 || y > canvas.height || snake.sections.indexOf(x + "," + y) >= 0) {
    		return true;
    	}
	},
  
	checkGrowth: function() {	
    	if (snake.x == food.x && snake.y == food.y) {	//check if it ate
    		game.score++;
    		if (game.score % 5 == 0 && game.fps < 60) {	//check for speed increase
				game.fps++;		//increase game speed
    		}
    		food.set();	//add new food
    	} else {
			snake.sections.shift();		//keep it moving
		}
	}
};

food = {
	size: null,
	x: null,
	y: null,
	color: "#EE00FF",
  
	set: function() {	//create new food
    	food.size = snake.size;
    	food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    	food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
	},
  
	draw: function() {	//place new food on board
    	game.drawBox(food.x, food.y, food.size, food.color);
	}
};

let inverseDirection = {
	"up": "down",
	"left": "right",
	"right": "left",
	"down": "up"
};

let keys = {
	up: [38, 87],			//W and Up arrow
	down: [40, 83],			//S and Down Arrow
	left: [37, 65],			//A and Left Arrow
	right: [39, 68],		//D and Right Arrow
	start_game: [13, 81]	//Enter and Q
};

function getKey(value){		//get inputs
	for (let key in keys){
    	if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      		return key;
    	}
  	}
	return null;
}

addEventListener("keydown", function (e) {
	let lastKey = getKey(e.keyCode);
    if (["up", "down", "left", "right"].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.direction]) {
    	snake.direction = lastKey;
    } else if (["start_game"].indexOf(lastKey) >= 0 && game.over) {
    	game.start();
		bitcoin();	//update some things between games
		joke();
		//launches();
		//news();
    }
}, false);

let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;	//should probably add a timeout to this

function loop() {	//main method
	if (game.over == false) {
    	game.resetCanvas();
    	game.drawScore();
    	snake.move();
    	food.draw();
    	snake.draw();
    	game.drawMessage();
	}
	setTimeout(function() {
    	requestAnimationFrame(loop);
  	}, 1000 / game.fps);
}

requestAnimationFrame(loop);	//update animation