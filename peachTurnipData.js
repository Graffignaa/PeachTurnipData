const { SlippiGame } = require("@slippi/slippi-js");
const { Frames } = require("@slippi/slippi-js");

const replayFolder = './Slippi/';
const fs = require('fs');
const prompt = require('prompt-sync')();

var files = [];

fs.readdirSync(replayFolder).forEach(file => {
  files.push(file);
});

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get input for player's connect code we are looking at stats for
const playerCode = prompt('Enter the connect code of the Peach player whose turnip stats you would like to calculate (I.e. TOES#318): ');
/*
Character IDs:
0  -  Captain Falcon
1  -  Donkey Kong
2  -  Fox
3  -  Mr. Game & Watch
4  -  Kirby
5  -  Bowser
6  -  Link
7  -  Luigi
8  -  Mario
9  -  Marth
10 -  Mewtwo
11 -  Ness
12 -  Peach
13 -  Pikachu
14 -  Ice Climbers
15 -  Jigglypuff
16 -  Samus
17 -  Yoshi
18 -  Zelda
19 -  Sheik
20 -  Falco
21 -  Young Link
22 -  Dr. Mario
23 -  Roy
24 -  Pichu
25 -  Ganondorf
*/

// Struct for games against each character
function charData(games, totalPulls, normalPulls, winkPulls, dotPulls, stitchPulls, saturnPulls, beamswordPulls, bombPulls) {
	
	// Number of games played against this character in this dataset
	this.games = games;
	// Total turnips pulled against this character in this data set
	this. totalPulls = totalPulls;
	// Normal turnips pulled against this character in this data set
	this.normalPulls = normalPulls;
	// Wink faces pulled against this character in this data set
	this.winkPulls = winkPulls;
	// Dot faces pulled against this character in this data set
	this.dotPulls = dotPulls;
	// Stitch faces pulled against this character in this data set
	this.stitchPulls = stitchPulls;
	// Mr. Saturns pulled against this character in this data set
	this.saturnPulls = saturnPulls;
	// Beam Swords pulled against this character in this data set
	this.beamswordPulls = beamswordPulls;
	// Bob-ombs pulled against this character in this data set
	this.bombPulls = bombPulls;
}

// Struct for a single game's turnip pull stats
function gameData(totalPulls, normalPulls, winkPulls, dotPulls, stitchPulls, saturnPulls, beamswordPulls, bombPulls) {
	
	// Total turnips pulled in this game
	this. totalPulls = totalPulls;
	// Normal turnips pulled in this game
	this.normalPulls = normalPulls;
	// Wink faces pulled in this game
	this.winkPulls = winkPulls;
	// Dot faces pulled in this game
	this.dotPulls = dotPulls;
	// Stitch faces pulled in this game
	this.stitchPulls = stitchPulls;
	// Mr. Saturns pulled in this game
	this.saturnPulls = saturnPulls;
	// Beam Swords pulled in this game
	this.beamswordPulls = beamswordPulls;
	// Bob-ombs pulled in this game
	this.bombPulls = bombPulls;
}

// Array to store data for each opposing character
var charArray = [];
// Fill array - array index corresponds to character ID
for(i = 0; i < 26; i++) {
	c = new charData(0, 0, 0, 0, 0, 0, 0, 0, 0);
	charArray.push(c);
}

//console.log(charArray);
let x = 1;
let y = 1;
files.forEach(file => {
	const filename = './Slippi/' + file;
	// Create game object
	const game = new SlippiGame(filename);
	// Get game settings
	const settings = game.getSettings();
	const metadata = game.getMetadata();

	
	var peach = -1;
	//console.log(filename);
	// We only want singles games.  
	// Currently ignoring games where metadata is null.  Will try to figure those out eventually if possible.  
	if (!settings.isTeams && metadata != null) {
		// Check if the specified player is player 1 and playing peach
		if(metadata.players[0].names.code == playerCode && settings.players[0].characterId == 12) { 
			peach = 0; 
		} 
		// Check if the specified player is player 2 and playing peach
		else if(metadata.players[1].names.code == playerCode && settings.players[1].characterId == 12) { 
			peach = 1;
		}
		// If neither is true, we can ignore the game
	}	

	// Check to see if all 4 stocks were taken.  Will ignore timeouts (exceedingly rare) for now.  
	var fullGame = false;
	if (peach != -1) {
		const stats = game.getStats();
		if(stats.overall[0].killCount == 4 || stats.overall[1].killCount == 4) {
			fullGame = true;
		}
	}
	

	if (peach != -1 && fullGame) {
		var opponentChar = -1;
		if(peach == 0) {
			opponentChar = settings.players[1].characterId;
		} else {
			opponentChar = settings.players[0].characterId;
		}
		//console.log(opponentChar);

		//Process the game and return a gameData object 
		g = processGame(game);
		console.log("Processed " + x + " game(s).");
		x++;
		//console.log(g);
	
		const c = charArray[opponentChar];
		var c2 = new charData(c.games + 1, 
			c.totalPulls + g.totalPulls, 
			c.normalPulls + g.normalPulls, 
			c.winkPulls + g.winkPulls,
			c.dotPulls + g.dotPulls,
			c.stitchPulls + g.stitchPulls,
			c.saturnPulls + g.saturnPulls,
			c.beamswordPulls + g.beamswordPulls,
			c.bombPulls + g.bombPulls);
		charArray[opponentChar] = c2;

	} else {
		console.log("Ignored " + y + " game(s).");
		y++;
	}
})
console.log(" ");
console.log("Per Character Turnip Stats: ");
console.log(" ");
for(j = 0; j < 26; j++) {
	switch(j) {
		case 0: 
			console.log("Stats Vs. Captain Falcon: ");
			break;
		case 1: 
			console.log("Stats Vs. Donkey Kong: ");
			break;	
		case 2: 
			console.log("Stats Vs. Fox: ");
			break;	
		case 3: 
			console.log("Stats Vs. Mr. Game and Watch: ");
			break;	
		case 4: 
			console.log("Stats Vs. Kirby: ");
			break;	
		case 5: 
			console.log("Stats Vs. Bowser: ");
			break;	
		case 6: 
			console.log("Stats Vs. Link: ");
			break;	
		case 7: 
			console.log("Stats Vs. Luigi: ");
			break;	
		case 8: 
			console.log("Stats Vs. Mario: ");
			break;	
		case 9: 
			console.log("Stats Vs. Marth: ");
			break;	
		case 10: 
			console.log("Stats Vs. Mewtwo: ");
			break;	
		case 11: 
			console.log("Stats Vs. Ness: ");
			break;	
		case 12: 
			console.log("Stats Vs. Peach: ");
			break;	
		case 13: 
			console.log("Stats Vs. Pikachu: ");
			break;	
		case 14: 
			console.log("Stats Vs. Ice Climbers: ");
			break;	
		case 15: 
			console.log("Stats Vs. Jigglypuff: ");
			break;	
		case 16: 
			console.log("Stats Vs. Samus: ");
			break;	
		case 17: 
			console.log("Stats Vs. Yoshi: ");
			break;	
		case 18: 
			console.log("Stats Vs. Zelda: ");
			break;	
		case 19: 
			console.log("Stats Vs. Sheik: ");
			break;	
		case 20: 
			console.log("Stats Vs. Falco: ");
			break;	
		case 21: 
			console.log("Stats Vs. Young Link: ");
			break;	
		case 22: 
			console.log("Stats Vs. Dr. Mario: ");
			break;	
		case 23: 
			console.log("Stats Vs. Roy: ");
			break;	
		case 24: 
			console.log("Stats Vs. Pichu: ");
			break;	
		case 25: 
			console.log("Stats Vs. Ganondorf: ");
			break;	
	}
	const c = charArray[j];
	console.log("Total Games: " + c.games);
	console.log("Total Pulls: " + c.totalPulls);
	console.log("Average Pulls Per Game: " + (c.totalPulls / c.games));
	console.log("Normal Turnips Pulled: " + c.normalPulls);
	console.log("Wink Faces Pulled: " + c.winkPulls);
	console.log("Dot Faces Pulled: " + c.dotPulls);
	console.log("Stitch Faces Pulled: " + c.stitchPulls);
	console.log("Mr. Saturns Pulled: " + c.saturnPulls);
	console.log("Beam Swords Pulled: " + c.beamswordPulls);
	console.log("Bob-ombs Pulled: " + c.bombPulls);
	console.log(" ");
}

// Process the given game object and return a gameData object containing turnip pull stats
function processGame(game) {
	const frames = game.getFrames();


	let lastSpawnId = -1;

	// Face Names
	let face0 = 0; //Normal
	let face1 = 0; //Eyebrow
	let face2 = 0; //Line
	let face3 = 0; //Circle
	let face4 = 0; //Carrot
	let face5 = 0; //Wink
	let face6 = 0; //Dot
	let face7 = 0; //Stitch
	let face255 = 0; //Undefined, should never occur if filtering properly
	let beam = 0; //Beam Sword
	let saturn = 0; //Mr. Saturn
	let bobomb = 0; //Bob-omb

	// Count turnips
	for (let frameNum = Frames.FIRST; frames[frameNum]; frameNum++) {
		const frame = frames[frameNum];
	        if (frame.items) { 
				frame.items.forEach((i) => {
		          	if (lastSpawnId < i.spawnId) {
						if(i.typeId == 99) {
							switch(i.turnipFace) {
								case 0:
									face0++;
									break;
								case 1: 
									face1++;
									break;
								case 2: 
									face2++;
									break;
								case 3:
									face3++;
									break;
								case 4:
									face4++;
									break;
								case 5: 
									face5++;
									break;
								case 6: 
									face6++;
									break;
								case 7:
									face7++;
									break;
								case 255:
									face255++;
									break;
								default:
									console.log("Invalid turnip face found: " + i.turnipFace);
							}
						} else if(i.typeId == 12) {
							beam++;
						} else if(i.typeId == 6) {
							bobomb++;
						} else if(i.typeId == 7) {
							saturn++;
						}

						lastSpawnId = i.spawnId;
		         	 }
		        });	
			}
	}
	if(face255 > 0) {
		console.log("This many Undefined turnips were pulled: " + face255);
	}
	let totalPulls = face0+face1+face2+face3+face4+face5+face6+face7+beam+bobomb+saturn;
	let normalTurnips = face0+face1+face2+face3+face4;


	// console.log("Total Turnips Pulled: " + totalPulls);
	// console.log("Normal Turnips Pulled: " + normalTurnips);
	// console.log("Winky Faces Pulled: " + face5);
	// console.log("Dot Faces Pulled: " + face6);
	// console.log("Stitch Faces Pulled: " + face7);
	// console.log("Beam Swords Pulled: "+ beam);
	// console.log("Bob-ombs Pulled: "+ bobomb);
	// console.log("Mr. Saturns Pulled: "+ saturn);

	// console.log(" ");
	// console.log("Detailed face breakdown:");
	// console.log("face0: "+ face0);
	// console.log("face1: "+ face1);
	// console.log("face2: "+ face2);
	// console.log("face3: "+ face3);
	// console.log("face4: "+ face4);
	// console.log("face5: "+ face5);
	// console.log("face6: "+ face6);
	// console.log("face7: "+ face7);
	// console.log("face255: "+ face255);

	g = new gameData(totalPulls, normalTurnips, face5, face6, face7, saturn, beam, bobomb);
	return g;
}

