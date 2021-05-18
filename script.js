const { SlippiGame } = require("@slippi/slippi-js");
const { Frames } = require("@slippi/slippi-js");

const replayFolder = './Slippi/';
const fs = require('fs');

var games = [];

fs.readdirSync(replayFolder).forEach(file => {
  games.push(file);
});



const game = new SlippiGame("error.slp");

// Get game settings – stage, characters, etc
const settings = game.getSettings();
console.log(settings);

// Get metadata - start time, platform played on, etc
const metadata = game.getMetadata();
console.log(metadata);
//console.log(metadata.players[0]);

// Get computed stats - openings / kill, conversions, etc
const stats = game.getStats();
console.log(stats);

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const frames = game.getFrames();


let lastSpawnId = -1;

// Face Names (Tentative)
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

for (let frameNum = Frames.FIRST; frames[frameNum]; frameNum++) {
	const frame = frames[frameNum];
        if (frame.items) { 
		frame.items.forEach((i) => {
          	if (lastSpawnId < i.spawnId) {
			if(i.typeId == 99) {
				if(i.turnipFace == 1) {
					face1++;
				} if(i.turnipFace == 2) {
					face2++;
				} if(i.turnipFace == 3) {
					face3++;
				} if(i.turnipFace == 4) {
					face4++;
				} if(i.turnipFace == 5) {
					face5++;
				} if(i.turnipFace == 6) {
					face6++;
				} if(i.turnipFace == 7) {
					face7++;
				} if(i.turnipFace == 255) {
					face255++;
				} if(i.turnipFace == 0) {
					face0++;
				} 
			} else if(i.typeId == 12) {
				beam++;
			} else if(i.typeId == 6) {
				console.log(i);
				bobomb++;
			} else if(i.typeId == 7) {
				saturn++;
			}
			// Beam sword is 0x0C = 12
			// Bob-omb is 0x06 = 6
			// Mr. Saturn is 0x07 = 7
			
			if(i.typeId != 99) {
			//	console.log(i);
			}
			
			lastSpawnId = i.spawnId;
            		
         	 }
        });	
	}
}
let totalPulls = face0+face1+face2+face3+face4+face5+face6+face7+beam+bobomb+saturn;
let normalTurnips = face0+face1+face2+face3+face4;

console.log("Total Turnips Pulled: " + totalPulls);
console.log("Normal Turnips Pulled: " + normalTurnips);
console.log("Winky Faces Pulled: " + face5);
console.log("Dot Faces Pulled: " + face6);
console.log("Stitch Faces Pulled: " + face7);
console.log("Beam Swords Pulled: "+ beam);
console.log("Bob-ombs Pulled: "+ bobomb);
console.log("Mr. Saturns Pulled: "+ saturn);

console.log(" ");
console.log("Detailed face breakdown:");
console.log("face0: "+ face0);
console.log("face1: "+ face1);
console.log("face2: "+ face2);
console.log("face3: "+ face3);
console.log("face4: "+ face4);
console.log("face5: "+ face5);
console.log("face6: "+ face6);
console.log("face7: "+ face7);
console.log("face255: "+ face255);

