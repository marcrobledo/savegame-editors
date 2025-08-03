u8 ChallengeCounter = 0;
u8 LvlCounter = 0;

import std.mem;
import std.string;

// https://www.geeksforgeeks.org/javascript/check-if-a-given-bit-is-set-or-not-using-javascript/
fn isBitSet(u8 num, u8 offset) {
	return ((num & 1 << offset)) != 0;
};

struct header_t {
	u32 crc32 @ 0x00;
	u8 lastPlayedOffset1 @ 0x06;
	u8 lastPlayedOffset2 @ 0x454;
	char signature[16] @ 0x08;
	u8 musicMicrophoneOffset @ 0x18;
	u8 languageOffset @ 0x19;
	u8 profileSelectionOffset @ 0x1A;
};

struct YellowStoneOffset {
	u24 yellowStoneOffset;
	padding[5];
	LvlCounter += 1;
}[[
	comment("Level #" + std::string::to_string(LvlCounter)),
	name("Level #" + std::string::to_string(LvlCounter))
]];

struct ChallengeOffset {
	u8 challenges;
	ChallengeCounter += 1;
}[[
	comment("Challenge #" + std::string::to_string(ChallengeCounter)),
	name("Challenge #" + std::string::to_string(ChallengeCounter))
]];


fn upgrades( u8 a, u8 b ) {
	return b;
};

struct ChallengeLvls {
	ChallengeOffset challengeoffset[10];
	ChallengeCounter = 0;
	LvlCounter += 1;
}[[
	comment("Level #" + std::string::to_string(LvlCounter)),
	name("Level #" + std::string::to_string(LvlCounter))
]];

bitfield Upgrades {
	padding: 1;
	x2: 1 [[name("X2 Stud Multiplier")]];
	x4: 1 [[name("X4 Stud Multiplier")]];
	x6: 1 [[name("X6 Stud Multiplier")]];
	x8: 1 [[name("X8 Stud Multiplier")]];
	extraHeart: 1 [[name("Extra Heart")]];
	bubbleEffects: 1 [[name("Bubble Effects")]];
	confettiEffects: 1 [[name("Confetti Effects")]];
	studMagnet: 1 [[name("Stud Magnet")]];
	healthRegeneration: 1 [[name("Health Regeneration")]];
	invicibility: 1 [[name("Invincibility")]];
	miniGameMaster: 1 [[name("Mini Game Master")]];
	fastBuild: 1 [[name("Fast Build")]];
	collectableDetector: 1 [[name("Collectable Detector")]];
	fastUse: 1 [[name("Fast Use")]];
	alwaysCharged: 1 [[name("Always Charged")]];
};

fn characterStatus( u8 a ) {
		match(a) {
		(0x00): return "Locked";
		(0x01): return "Unlocked";
		(0x03): return "Unlocked + Bought";
	}
	return "Unknown";
};

bitfield Characters {
	character91: 2 [[name("Abraham Lincoln"), format("characterStatus")]];
	character90: 2 [[name("Bad Cop"), format("characterStatus")]];
	character89: 2 [[name("Bandit"), format("characterStatus")]];
	character88: 2 [[name("Batman"), format("characterStatus")]];
	character87: 2 [[name("Benny"), format("characterStatus")]];
	character86: 2 [[name("Blaze Firefighter"), format("characterStatus")]];
	character85: 2 [[name("Bruce Wayne"), format("characterStatus")]];
	character84: 2 [[name("Calamity Drone"), format("characterStatus")]];
	character83: 2 [[name("Cardio Carrie"), format("characterStatus")]];
	character82: 2 [[name("Cavalry"), format("characterStatus")]];
	character81: 2 [[name("Caveman"), format("characterStatus")]];
	character80: 2 [[name("Cleopatra"), format("characterStatus")]];
	character79: 2 [[name("Deputron"), format("characterStatus")]];
	character78: 2 [[name("Dr McScrubs"), format("characterStatus")]];
	character77: 2 [[name("El Macho Wrestler"), format("characterStatus")]];
	character76: 2 [[name("Emmet (Piece of Resistance)"), format("characterStatus")]];
	character75: 2 [[name("Emmet (Clown)"), format("characterStatus")]];
	character74: 2 [[name("Emmet (Construction)"), format("characterStatus")]];
	character73: 2 [[name("Emmet (Lizard)"), format("characterStatus")]];
	character72: 2 [[name("Emmet (Magician)"), format("characterStatus")]];
	character71: 2 [[name("Emmet (Master Builder)"), format("characterStatus")]];
	character70: 2 [[name("Emmet (PJs)"), format("characterStatus")]];
	character69: 2 [[name("Emmet (Robin Hood)"), format("characterStatus")]];
	character68: 2 [[name("Emmet (Robot)"), format("characterStatus")]];
	character67: 2 [[name("Emmet (Shower)"), format("characterStatus")]];
	character66: 2 [[name("Emmet (Surgeon)"), format("characterStatus")]];
	character65: 2 [[name("Emmet (Old West)"), format("characterStatus")]];
	character64: 2 [[name("Foreman Frank"), format("characterStatus")]];
	character63: 2 [[name("Gail"), format("characterStatus")]];
	character62: 2 [[name("Gallant Guard"), format("characterStatus")]];
	character61: 2 [[name("Gandalf"), format("characterStatus")]];
	character60: 2 [[name("Garbage Man Dan"), format("characterStatus")]];
	character59: 2 [[name("Good Cop"), format("characterStatus")]];
	character58: 2 [[name("Good Cop (Scribble Face)"), format("characterStatus")]];
	character57: 2 [[name("Gordon Zola"), format("characterStatus")]];
	character56: 2 [[name("Green Lantern"), format("characterStatus")]];
	character55: 2 [[name("Green Ninja"), format("characterStatus")]];
	character54: 2 [[name("Hank Haystack"), format("characterStatus")]];
	character53: 2 [[name("Ice Cream Jo"), format("characterStatus")]];
	character52: 2 [[name("Johnny Thunder"), format("characterStatus")]];
	character51: 2 [[name("Kabob Bob"), format("characterStatus")]];
	character50: 2 [[name("Lady Liberty"), format("characterStatus")]];
	character49: 2 [[name("Larry the Barrista"), format("characterStatus")]];
	character48: 2 [[name("Swamp Creature"), format("characterStatus")]];
	character47: 2 [[name("Lord Business"), format("characterStatus")]];
	character46: 2 [[name("Lord Vampyre"), format("characterStatus")]];
	character45: 2 [[name("Ma Cop"), format("characterStatus")]];
	character44: 2 [[name("Michelangelo"), format("characterStatus")]];
	character43: 2 [[name("Mrs Scratchen-Post"), format("characterStatus")]];
	character42: 2 [[name("Mummy"), format("characterStatus")]];
	character41: 2 [[name("Native Chief"), format("characterStatus")]];
	character40: 2 [[name("Native Warrior"), format("characterStatus")]];
	character39: 2 [[name("Outlaw"), format("characterStatus")]];
	character38: 2 [[name("Pa Cop"), format("characterStatus")]];
	character37: 2 [[name("Panda Guy"), format("characterStatus")]];
	character36: 2 [[name("Plumber Joe"), format("characterStatus")]];
	character35: 2 [[name("President Business"), format("characterStatus")]];
	character34: 2 [[name("Prospector"), format("characterStatus")]];
	character33: 2 [[name("Robo Construction"), format("characterStatus")]];
	character32: 2 [[name("Robo Cowboy"), format("characterStatus")]];
	character31: 2 [[name("Robo Demolition"), format("characterStatus")]];
	character30: 2 [[name("Robo Agent"), format("characterStatus")]];
	character29: 2 [[name("Robo Pilot"), format("characterStatus")]];
	character28: 2 [[name("Robo Receptionist"), format("characterStatus")]];
	character27: 2 [[name("Rootbeer Belle"), format("characterStatus")]];
	character26: 2 [[name("S.S.P Officer"), format("characterStatus")]];
	character25: 2 [[name("S.S.P Officer (Beanie)"), format("characterStatus")]];
	character24: 2 [[name("S.S.P Officer (Heavy)"), format("characterStatus")]];
	character23: 2 [[name("S.S.P Officer (SWAT)"), format("characterStatus")]];
	character22: 2 [[name("Sharon Shoehorn"), format("characterStatus")]];
	character21: 2 [[name("Sheriff Not-A-Robot"), format("characterStatus")]];
	character20: 2 [[name("Sir Stackabrick"), format("characterStatus")]];
	character19: 2 [[name("Sudds Backwash"), format("characterStatus")]];
	character18: 2 [[name("Superman"), format("characterStatus")]];
	character17: 2 [[name("Taco Tuesday Guy"), format("characterStatus")]];
	character16: 2 [[name("Test Dummy"), format("characterStatus")]];
	character15: 2 [[name("Unikitty"), format("characterStatus")]];
	character14: 2 [[name("Unikitty (Business)"), format("characterStatus")]];
	character13: 2 [[name("Unikitty (Queasy)"), format("characterStatus")]];
	character12: 2 [[name("Unikitty (Space)"), format("characterStatus")]];
	character11: 2 [[name("Velma Staplebot"), format("characterStatus")]];
	character10: 2 [[name("Vitruvius"), format("characterStatus")]];
	character9: 2 [[name("Vitruvius (Young)"), format("characterStatus")]];
	character8: 2 [[name("\"Where Are My Pants?\" Guy"), format("characterStatus")]];
	character7: 2 [[name("Wiley Fusebot"), format("characterStatus")]];
	character6: 2 [[name("William Shakespeare"), format("characterStatus")]];
	character5: 2 [[name("Wonder Woman"), format("characterStatus")]];
	character4: 2 [[name("Wyldstyle"), format("characterStatus")]];
	character3: 2 [[name("Wyldstyle (Hooded)"), format("characterStatus")]];
	character2: 2 [[name("Wyldstyle (Robot)"), format("characterStatus")]];
	character1: 2 [[name("Wyldstyle (Space)"), format("characterStatus")]];
	character0: 2 [[name("Wyldstyle (Old West)"), format("characterStatus")]];
};

struct profile1_t { // profile starts at 28
	padding[8];
	ChallengeLvls challengelvls[45];
	padding[94];
	u24 blueStoneOffset;
	padding[13];
	LvlCounter = 0;
	YellowStoneOffset yellowstoneoffset[45];	
	padding[213];
	Upgrades upgradesUnlocked1 [[name("Upgrades - Unlocked")]];
	Upgrades upgradesBought1 [[name("Upgrades - Bought")]];
	padding[3];
	Characters Characters1 [[name("Characters")]];
	padding[17];
	u8 sectionUnlockOffset[23];
	padding[37];
};

struct Chunks {
	profile1_t profile1_chunk [[comment("Profile 1")]];
	profile1_t profile2_chunk [[comment("Profile 2")]];
};

header_t header @ 0x00 [[comment("Contains the data outside the profiles."), name("Main game")]];
Chunks chunks @ 0x1C [[comment("Contains the data of each profile."), name("Profiles")]];