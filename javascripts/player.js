var saveGame = [];

var player = {
    currentTab: 'energy',

    colors: {
        background: hslToHex(0,0,0),
        text: hslToHex(0,0,100),
        altText: hslToHex(240,50,70),
        boughtText: hslToHex(240,30,90),
        validEdge: hslToHex(0,0,70),
        invalidEdge: hslToHex(0,30,50),
        boughtEdge: hslToHex(240,30,70),
        validFill: hslToHex(0,0,20),
        invalidFill: hslToHex(0,40,30),
        boughtFill: hslToHex(240,40,40),
        hoverFill: hslToHex(0,0,30),
        fieldBackground: hslToHex(0,0,15),
        wonFill: hslToHex(0,100,30),
        wonEdge: hslToHex(0,100,50),
        wonText: hslToHex(0,100,70),
    },

    energyPointGoal: new Decimal("10"),
    energyPoints: new Decimal("0"),
    isFirstRun: true,
    currentEnergySpeedrun: new Decimal("1"),
    runningEnergySpeedrun: true,
    energySpeedrunTimer: false,
    stateOfEnergySpeedrun: 'running',
    energyPointMult: new Decimal(1),
    energyGenMult: new Decimal(1),
    totalEnergySpeedrunCompletions: new Decimal(0),
    energyBoost: new Decimal(1),

    prestigePoints: new Decimal("0"),
    autoCompleteEnergySpeedrun: false,
    prestigeBoost: new Decimal("1"),
    prestigeUpgradesUnlocked: new Decimal("4"),
    energyUpgradesunlocked: new Decimal("4"),
    energySpeedrunsUnlocked: new Decimal("1"),

    energyPointGenAmount: new Decimal("0"),
    energyUpgradeArr: [],
    prestigeUpgradeArr: [false,false,false,false,false,false],

    autoSave: false,
    energySpeedrun4Completions: new Decimal("0"),
    energyGeneratorAutobuyer: false,

    autoCrank: false,
    manualCranks: new Decimal("0"),
    timeTimer: new Decimal("0"),
    winTimer: new Decimal("0"),
    hasWon: false,
    guideRevealed: false,
    zoomAmount: 1,
}



var energyPointCrankMult = new Decimal("1");




//declaring class templates
//energy buildings
var energyPointGen = new building ('energyPointGen','energyPoints',false,new Decimal("10"),new Decimal("10"),new Decimal("1.5"),new Decimal("0"));
var energyBuildingArr = [energyPointGen];

//energy upgrades
var energyUpgrade1 = new energyUpgrade(1,new Decimal('1e3'),true);
var energyUpgrade2 = new energyUpgrade(2,new Decimal('1e4'),true);
var energyUpgrade3 = new energyUpgrade(3,new Decimal('1e5'),true);
var energyUpgrade4 = new energyUpgrade(4,new Decimal('1e6'),true);
var energyUpgrade5 = new energyUpgrade(5,new Decimal('1e6'),false);
var energyUpgrade6 = new energyUpgrade(6,new Decimal('1e6'),false);
var energyUpgrade7 = new energyUpgrade(7,new Decimal('1e9'),false);
var energyUpgrade8 = new energyUpgrade(8,new Decimal('2.5e10'),false);
var energyUpgradeArr = [energyUpgrade1,energyUpgrade2,energyUpgrade3,energyUpgrade4,energyUpgrade5,energyUpgrade6,energyUpgrade7,energyUpgrade8];

energyUpgrade3.effectSet(new Decimal(2));
energyUpgrade7.effectSet(new Decimal(10));



//speedruns
//(speedrunNum, energyPointGoal, featuresAllowed, prestigeAward, maxTimer)
var energySpeedrun1 = new energySpeedrun (new Decimal("1"),new Decimal("10"),[true,false],new Decimal("1"),false,true);
var energySpeedrun2 = new energySpeedrun (new Decimal("2"),new Decimal("1000"),[true,true,false],new Decimal("10"),new Decimal("60"),false);
var energySpeedrun3 = new energySpeedrun (new Decimal("3"),new Decimal("250"),[false,true,false],new Decimal("25"),new Decimal("30"),false);
var energySpeedrun4 = new energySpeedrun (new Decimal("4"),new Decimal("1e6"),[false,true,true],new Decimal("1000"),new Decimal("60"),false);
var energySpeedrun5 = new energySpeedrun (new Decimal("5"),new Decimal("1e6"),[true,true,false],new Decimal("1e4"),new Decimal("60"),false);
var energySpeedrun6 = new energySpeedrun (new Decimal("6"),new Decimal("1e12"),[true,true,true],new Decimal("1e6"),new Decimal("120"),false);
var energySpeedrunArr = [energySpeedrun1,energySpeedrun2,energySpeedrun3,energySpeedrun4,energySpeedrun5,energySpeedrun6];
var energySpeedrunRewards = [];



//prestige upgrades
var prestigeUpgrade1 = new prestigeUpgrade(1,new Decimal(5),true);
var prestigeUpgrade2 = new prestigeUpgrade(2,new Decimal(10),true);
var prestigeUpgrade3 = new prestigeUpgrade(3,new Decimal(25),true);
var prestigeUpgrade4 = new prestigeUpgrade(4,new Decimal(50),true);
var prestigeUpgrade5 = new prestigeUpgrade(5,new Decimal(250),false);
var prestigeUpgrade6 = new prestigeUpgrade(6,new Decimal(500),false);
var prestigeUpgrade7 = new prestigeUpgrade(7,new Decimal("1e4"),false);
var prestigeUpgrade8 = new prestigeUpgrade(8,new Decimal("1e4"),false);
var prestigeUpgrade9 = new prestigeUpgrade(9,new Decimal("1e4"),false);
var prestigeUpgrade10 = new prestigeUpgrade(10,new Decimal('5e4'),false);
var prestigeUpgrade11 = new prestigeUpgrade(11,new Decimal("2e5"),false);
var prestigeUpgrade12 = new prestigeUpgrade(12,new Decimal("2e5"),false);
var prestigeUpgradeArr = [prestigeUpgrade1,prestigeUpgrade2,prestigeUpgrade3,prestigeUpgrade4,prestigeUpgrade5,prestigeUpgrade6,prestigeUpgrade7,prestigeUpgrade8,prestigeUpgrade9,prestigeUpgrade10,prestigeUpgrade11,prestigeUpgrade12];







function accessSave(value) {
    if (typeof saveGame[value] !== "undefined") player[value] = saveGame[value];
}

function accessSaveNum(value) {
    if (typeof saveGame[value] !== "undefined") player[value] = new Decimal(saveGame[value]);
}

var saveKey = "speedrun-dimensions-save-5"

//save and load
function save() {
    for (let i = 0; i < prestigeUpgradeArr.length; i++) {
        prestigeUpgradeArr[i].update();
        player.prestigeUpgradeArr[i] = prestigeUpgradeArr[i].bought;
    }
    for (let i = 0; i < energyUpgradeArr.length; i++) {
        player.energyUpgradeArr[i] = energyUpgradeArr[i].bought;
    }

    localStorage.setItem(saveKey,JSON.stringify(player));
}

window.onload = function() {
    if (localStorage.getItem(saveKey) === null) {
        localStorage.setItem(saveKey,JSON.stringify(player));
        changeTab('energy');
        energySpeedrun1.start();
        player.stateOfEnergySpeedrun = 'running';
        player.guideRevealed = false;
        player.hasWon = false;
    }
    loadData();
}

function loadData() {
    saveGame = JSON.parse(localStorage.getItem(saveKey));

    let autoLoadArr = ['colors','isFirstRun','runningEnergySpeedrun','stateOfEnergySpeedrun','autoCompleteEnergySpeedrun','autoSave','energyGeneratorAutobuyer', 'autoCrank','hasWon','guideRevealed','zoomAmount'];
    let autoLoadArrNum = ['energyPoints','energyPointGoal','currentEnergySpeedrun','totalEnergySpeedrunCompletions','prestigePoints','prestigeUpgradesUnlocked','energyUpgradesUnlocked','energySpeedrunsUnlocked','energySpeedrun4Completions','energyGeneratorAutobuyerVal','manualCranks','timeTimer','winTimer'];

    energyPointGen.amount = new Decimal(saveGame.energyPointGenAmount);
    for (let i = 0; i < saveGame.energyUpgradeArr.length; i++) {
        energyUpgradeArr[i].bought = saveGame.energyUpgradeArr[i];
    }
    for (let i = 0; i < saveGame.prestigeUpgradeArr.length; i++) {
        prestigeUpgradeArr[i].bought = saveGame.prestigeUpgradeArr[i];
    }


    for (let i = 0; i < autoLoadArr.length; i++) {
        accessSave(autoLoadArr[i]);
    }
    for (let i = 0; i < autoLoadArrNum.length; i++) {
        accessSaveNum(autoLoadArrNum[i]);
    }
    accessSaveNum('energyPoints');
    document.getElementById('zoomSlider').value = (player.zoomAmount*100).toString();

    changeTab(saveGame.currentTab);

    //update css colors
    for (const key in player.colors) {
        updateColor(`${key}`);
    }

    if (player.isFirstRun) {
        hideElement('prestigeTab');
    }
    else {
        flexElement('prestigeTab');
    }

    changeBoolDisplay(player.autoCompleteEnergySpeedrun,'toggleAutoEnergySpeedrun');
    changeBoolDisplay(player.autoSave,'toggleAutoSave');
    changeBoolDisplay(player.autoCrank,'toggleAutoCrank');
    changeBoolDisplay(player.energyGeneratorAutobuyer,'toggleEnergyGeneratorAutobuyer');
    updatePrestigeUpgradeInfo(1);
    updateEnergyUpgradeInfo(1);
    updateEnergySpeedrunInfo(player.currentEnergySpeedrun.toNumber());

    if (saveGame.energySpeedrunTimer === false) {
        player.energySpeedrunTimer = false;
    }
    else {
        energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].timer = new Decimal(saveGame.energySpeedrunTimer);
    }

    for(let i = 0; i < player.energySpeedrunsUnlocked.toNumber(); i++) {
        energySpeedrunArr[i].displayed = true;
    }

    if (player['energyGeneratorAutobuyerVal'] === undefined) {
        player['energyGeneratorAutobuyerVal'] = new Decimal('30');
    }
    document.getElementById("energyGeneratorAutobuyerAmountInput").value = player['energyGeneratorAutobuyerVal'].toNumber();
}

function resetSave() {
    player.timeTimer = new Decimal("0");
    player.winTimer = new Decimal("0");
    player.guideRevealed = false;
    player.hasWon = false;
    player.currentTab = 'energy';

    player.colors = {
        background: hslToHex(0,0,0),
        text: hslToHex(0,0,100),
        altText: hslToHex(240,50,70),
        boughtText: hslToHex(240,30,90),
        validEdge: hslToHex(0,0,70),
        invalidEdge: hslToHex(0,30,50),
        boughtEdge: hslToHex(240,30,70),
        validFill: hslToHex(0,0,20),
        invalidFill: hslToHex(0,40,30),
        boughtFill: hslToHex(240,40,40),
        hoverFill: hslToHex(0,0,30),
        fieldBackground: hslToHex(0,0,15)
    };

    player.energyPointGoal = new Decimal("10");
    player.energyPoints = new Decimal("0");
    player.isFirstRun = true;
    player.currentEnergySpeedrun = new Decimal("1");
    player.runningEnergySpeedrun = true;
    player.stateOfEnergySpeedrun = 'none';
    player.energyPointMult = new Decimal(1);
    player.energyGenMult = new Decimal(1);
    player.totalEnergySpeedrunCompletions = new Decimal(0);
    player.energyBoost = new Decimal(1);

    player.prestigePoints = new Decimal("0");
    player.autoCompleteEnergySpeedrun = false;
    player.prestigeBoost = new Decimal("1");
    player.prestigeUpgradesUnlocked = new Decimal("4");
    player.energyUpgradesunlocked = new Decimal("4");
    player.energySpeedrunsUnlocked = new Decimal("1");
    player.energySpeedrun4Completions = new Decimal("0");
    player.energyGeneratorAutobuyer = false;
    player.energyGeneratorAutoBuyerVal = new Decimal("30");
    document.getElementById("energyGeneratorAutobuyerAmountInput").value = 30;
    for (let i = 0; i < energySpeedrunArr.length; i++) {
        energySpeedrunArr[i].displayed = false;
    }
    energySpeedrun1.displayed = true;
    player.energyPointGenAmount = new Decimal("0");

    for (let i = 0; i < energyUpgradeArr.length; i++) {
        energyUpgradeArr[i].bought = false;
    }
    for (let i = 0; i < prestigeUpgradeArr.length; i++) {
        prestigeUpgradeArr[i].bought = false;
    }

    for (const key in player.colors) {
        updateColor(`${key}`);
    }
    //hideElement('prestigeTab');
    if (player.isFirstRun) {
        hideElement('prestigeTab');
        energySpeedrun1.start();
    }

    changeTab(player.currentTab);

    changeBoolDisplay(player.autoCompleteEnergySpeedrun,'toggleAutoEnergySpeedrun');
    player.autoSave = false;
    changeBoolDisplay(player.autoSave,'toggleAutoSave');
    changeBoolDisplay(player.energyGeneratorAutobuyer,'toggleEnergyGeneratorAutobuyer');
    updatePrestigeUpgradeInfo(1);
    updateEnergyUpgradeInfo(1);
    updateEnergySpeedrunInfo(1);
}

function resetSavePrompt() {
    var resetSaveAnswer = prompt("To Reset Your Save, Please Type 'Yes'. Otherwise, hit cancel.");
    if (resetSaveAnswer === "Yes") {
        resetSave();
    }
}

function toggleGuide() {
    player.guideRevealed = !player.guideRevealed;
}

function inviteToMyDiscord() {
    document.getElementById("hiddenDiscordLink").click();
}

function inviteToIGJDiscord() {
    document.getElementById("hiddenIGJDiscordLink").click();
}

function inviteToMyGithub() {
    document.getElementById("hiddenGithubLink").click();
}

function inviteToIGJItch() {
    document.getElementById("hiddenIGJItchLink").click();
}
