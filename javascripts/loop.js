document.addEventListener("DOMContentLoaded", function () {
    let currentTime = Date.now();
    setInterval(mainLoop, 20);
    //setInterval(slowLoop, 1000);
    let elapsedTime = Date.now() - currentTime;

    function mainLoop() {
        elapsedTime += Date.now() - currentTime;
        currentTime = Date.now();
        if (elapsedTime > 100) { elapsedTime = 100 };
        while (elapsedTime > 20) {
            elapsedTime -= 20;
            //do stuff
            mainGameLoop();
        }
        updateDisplay();
    }
});

function mainGameLoop() {
    energySpeedrunRewards = [1,10,25];
    if (player.stateOfEnergySpeedrun === 'running') {
        gainEnergyPoints(energyPointGen.generating.div(50).div(player.energyPointMult));
    }
    player.prestigeBoost = Decimal.add(Decimal.log10(new Decimal.max(player.prestigePoints,1)),1);

    energyPointGen.calc();
    energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].calc();

    prestigeUpgrade2.effectSet(new Decimal("2"));
    prestigeUpgrade4.effectSet(Decimal.max(Decimal.log10(Decimal.max(player.totalEnergySpeedrunCompletions,1)),1));

    player.energyPointMult = player.prestigeBoost;
    if (prestigeUpgrade4.bought) {
        player.energyPointMult = Decimal.mul(prestigeUpgrade4.effect,player.energyPointMult);
    }

    if (player.autoCompleteEnergySpeedrun) {
        if (player.energyPoints.gte(player.energyPointGoal)) {
            energyPointGoalCompleted();
        }
    }

    if (prestigeUpgrade2.bought) {
        player.energyGenMult = new Decimal(2);
    }
}

function updateDisplay() {
    //energy updates

    if (player.currentTab === 'energy') {
        if (player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal) && player.stateOfEnergySpeedrun === 'running') {
            addClass('energyPointGoalDisplay','normBtn');
        }
        else if (player.stateOfEnergySpeedrun !== 'failed') {
            removeClass('energyPointGoalDisplay','normBtn');
        }
        if (player.stateOfEnergySpeedrun === 'running') {
            updateText('energyPointGoalDisplay',('Current Energy Goal: ' + format(player.energyPointGoal,2) + ' Energy Points'));
        }
        else if (player.stateOfEnergySpeedrun === 'failed') {
            updateText('energyPointGoalDisplay',('Speedrun Failed - Click To Reset Speedrun'));
            addClass('energyPointGoalDisplay','normBtn');
        }
        updateText('energyPointDisplay',('You Have ' + format(player.energyPoints,2) + ' Energy Points'));
        updateText('energyPointCrankDisplay',('Gain ' + format(player.energyPointMult,2) + ' Energy Points'));

        energyPointGen.update();
    }
    updateText('energyPointHeader',(format(player.energyPoints,2) + ' EP'));


    //prestige updates
    if (player.currentTab === 'prestige') {
        updateText('prestigePointDisplay',('You Have ' + format(player.prestigePoints,2) + ' Prestige Points'));
        updateText('prestigeBoostDisplay',('Your Prestige Points Create A ' + format(player.prestigeBoost,2) + 'x Boost To Energy Gain'));

        if (prestigeUpgradeArr[0].bought) {
            flexElement('toggleAutoEnergySpeedrunBtn');
        }
        else {
            hideElement('toggleAutoEnergySpeedrunBtn');
        }

        for (i = 0; i < prestigeUpgradeArr.length; i++) {
            prestigeUpgradeArr[i].update();
        }
    }
    
    updateText('prestigePointHeader',(format(player.prestigePoints,2) + ' PP'));

    energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].update();



    //scale window
    let win = window;
    doc = document;
    docElem = doc.documentElement;
    body = doc.getElementsByTagName('body')[0];
    x = win.innerWidth || docElem.clientWidth || body.clientWidth;
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    document.getElementById("gameWindow").style.transform = "scale(" + x/1100 + ")";
}