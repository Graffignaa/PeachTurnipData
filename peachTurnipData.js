const { SlippiGame } = require("@slippi/slippi-js");
const { Frames } = require("@slippi/slippi-js");

const fs = require('fs');
const prompt = require('prompt-sync')();

var files = [];
var out = ""
const replayFolder = prompt('Enter the directory containing .slp files.  Include ./ if this is located in the current directory.  I.e. ./slippi/: ');

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
	const filename = replayFolder + file;
	// Create game object
	const game = new SlippiGame(filename);
	// Get game settings
	const settings = game.getSettings();
	const metadata = game.getMetadata();

	
	var peach = -1;
	//console.log(filename);
	// We only want singles games.  
	// Currently ignoring games where metadata is null.  Will try to figure those out eventually if possible.  
	if (!settings.isTeams && metadata != null && metadata.players[0] != null) {
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
out += "Per Character Turnip Stats: \n"

console.log(" ");
for(j = 0; j < 26; j++) {
	switch(j) {
		case 0: 
			out += "Stats Vs. Captain Falcon: \n";
			break;
		case 1: 
			out += "Stats Vs. Donkey Kong: \n";
			break;	
		case 2: 
			out += "Stats Vs. Fox: \n";
			break;	
		case 3: 
			out += "Stats Vs. Mr. Game and Watch: \n";
			break;	
		case 4: 
			out += "Stats Vs. Kirby: \n";
			break;	
		case 5: 
			out += "Stats Vs. Bowser: \n";
			break;	
		case 6: 
			out += "Stats Vs. Link: \n";
			break;	
		case 7: 
			out += "Stats Vs. Luigi: \n";
			break;	
		case 8: 
			out += "Stats Vs. Mario: \n";
			break;	
		case 9: 
			out += "Stats Vs. Marth: \n";
			break;	
		case 10: 
			out += "Stats Vs. Mewtwo: \n";
			break;	
		case 11: 
			out += "Stats Vs. Ness: \n";
			break;	
		case 12: 
			out += "Stats Vs. Peach: \n";
			break;	
		case 13: 
			out += "Stats Vs. Pikachu: \n";
			break;	
		case 14: 
			out += "Stats Vs. Ice Climbers: \n";
			break;	
		case 15: 
			out += "Stats Vs. Jigglypuff: \n";
			break;	
		case 16: 
			out += "Stats Vs. Samus: \n";
			break;	
		case 17: 
			out += "Stats Vs. Yoshi: \n";
			break;	
		case 18: 
			out += "Stats Vs. Zelda: \n";
			break;	
		case 19: 
			out += "Stats Vs. Sheik: \n";
			break;	
		case 20: 
			out += "Stats Vs. Falco: \n";
			break;	
		case 21: 
			out += "Stats Vs. Young Link: \n";
			break;	
		case 22: 
			out += "Stats Vs. Dr. Mario: \n";
			break;	
		case 23: 
			out += "Stats Vs. Roy: \n";
			break;	
		case 24: 
			out += "Stats Vs. Pichu: \n";
			break;	
		case 25: 
			out += "Stats Vs. Ganondorf: \n";
			break;	
	}
	const c = charArray[j];
	out +="Total Games: " + c.games + "\n";
	out +="Total Pulls: " + c.totalPulls + "\n";
	out +="Average Pulls Per Game: " + (c.totalPulls / c.games) + "\n";
	out +="Normal Turnips Pulled: " + c.normalPulls + "\n";
	out +="Wink Faces Pulled: " + c.winkPulls + "\n";
	out +="Dot Faces Pulled: " + c.dotPulls + "\n";
	out +="Stitch Faces Pulled: " + c.stitchPulls + "\n";
	out +="Mr. Saturns Pulled: " + c.saturnPulls + "\n";
	out +="Beam Swords Pulled: " + c.beamswordPulls + "\n";
	out +="Bob-ombs Pulled: " + c.bombPulls + "\n";
	out +=" " + "\n";

	fs.writeFile(playerCode + 'turnipdata.txt', out, (err) => {
		if (err) throw err;
	})
	
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

