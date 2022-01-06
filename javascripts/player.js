var player = {
    currentTab: 'energy',

    version: 1.0,
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
        fieldBackground: hslToHex(0,0,15)
    },

    energyPointGoal: new Decimal("10"),
    energyPoints: new Decimal("0"),
    isFirstRun: true,
    currentEnergySpeedrun: new Decimal("1"),
    runningEnergySpeedrun: true,
    stateOfEnergySpeedrun: 'none',
    energyPointMult: new Decimal(1),
    energyGenMult: new Decimal(1),
    totalEnergySpeedrunCompletions: new Decimal(0),

    prestigePoints: new Decimal("0"),
    autoCompleteEnergySpeedrun: false,
    prestigeBoost: new Decimal("1"),
}







//declaring class templates
//energy buildings
var energyPointGen = new building ('energyPointGen','energyPoints',false,new Decimal("10"),new Decimal("10"),new Decimal("1.5"),new Decimal("0"));
var energyBuildingArr = [energyPointGen];



//speedruns
//(speedrunNum, energyPointGoal, featuresAllowed, prestigeAward, maxTimer)
var energySpeedrun1 = new energySpeedrun (new Decimal("1"),new Decimal("10"),[true,false],new Decimal("1"),false);
var energySpeedrun2 = new energySpeedrun (new Decimal("2"),new Decimal("1000"),[true,true],new Decimal("10"),new Decimal("60"));
var energySpeedrun3 = new energySpeedrun (new Decimal("3"),new Decimal("250"),[false,true],new Decimal("25"),new Decimal("30"));
var energySpeedrunArr = [energySpeedrun1,energySpeedrun2,energySpeedrun3];
var energySpeedrunRewards = [];



//prestige buildings
var prestigeUpgrade1 = new prestigeUpgrade(1,new Decimal(5),true);
var prestigeUpgrade2 = new prestigeUpgrade(2,new Decimal(10),true);
var prestigeUpgrade3 = new prestigeUpgrade(3,new Decimal(25),true);
var prestigeUpgrade4 = new prestigeUpgrade(4,new Decimal(50),true);
var prestigeUpgradeArr = [prestigeUpgrade1,prestigeUpgrade2,prestigeUpgrade3,prestigeUpgrade4];




/*window.onload = function () {
    for (const key in player.colors) {
        updateColor(`${key}`);
    }
    changeTab(player.currentTab);

    if (player.isFirstRun) {
        hideElement('prestigeTab');
    }
    energySpeedrun1.start();
    console.log(player.energyPointGoal);
}*/

for (const key in player.colors) {
    updateColor(`${key}`);
}
changeTab(player.currentTab);

if (player.isFirstRun) {
    hideElement('prestigeTab');
    energySpeedrun1.start();
}
