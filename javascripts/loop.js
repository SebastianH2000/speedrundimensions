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
    energyUpgrade1.effectSet(new Decimal(new Decimal(1.05).pow(energyPointGen.amount)));
    energyUpgrade4.effectSet(player.prestigeBoost);

    prestigeUpgrade2.effectSet(new Decimal("2"));
    prestigeUpgrade4.effectSet(Decimal.max(Decimal.log10(Decimal.max(player.totalEnergySpeedrunCompletions,1)),1));
    prestigeUpgrade5.effectSet(Decimal.floor(Decimal.add(Decimal.log10(new Decimal.max(player.prestigePoints,1)),1)));
    energySpeedrunRewards = [1,10,25,1000];
    player.prestigeBoost = Decimal.add(Decimal.log10(new Decimal.max(player.prestigePoints,1)),1);

    //energy boost
    //energy breaks into negative trillions after buying energy boost and going into speedruns 2-4
    prestigeUpgrade6.effectSet(Decimal.add(Decimal.log10(new Decimal.max(player.energyPoints,1)),1));
    prestigeUpgrade7.effectSet(Decimal.add(Decimal.div(Decimal.log10(new Decimal.max(player.energySpeedrun4Completions,1)),2),1));
    if (prestigeUpgrade6.bought) {
        player.energyBoost = prestigeUpgrade6.effect;
    }
    else {
        player.energyBoost = new Decimal("1");
    }

    energyPointGen.calc();
    energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].calc();

    player.energyPointMult = player.prestigeBoost;
    if (prestigeUpgrade4.bought) {
        player.energyPointMult = Decimal.mul(prestigeUpgrade4.effect,player.energyPointMult).mul(player.energyBoost);
    }
    if (prestigeUpgrade7.bought) {
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

    //energy gen calc
    if (player.stateOfEnergySpeedrun === 'running') {
        energyPointGen.update();
        gainEnergyPoints(energyPointGen.generating.div(50).div(player.energyPointMult));
        player.energyPointGenAmount = energyPointGen.amount;
    }
}

function updateDisplay() {
    //energy updates
    if (player.currentTab === 'energy') {
        if (player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal) && player.stateOfEnergySpeedrun === 'running') {
            addClass('energyPointGoalDisplay','normBtn');
            updateText('energyPointGoalDisplay',('Complete This Speedrun (Goal: ' + format(player.energyPointGoal,2) + ' EP)'));
        }
        else if (player.stateOfEnergySpeedrun !== 'failed') {
            removeClass('energyPointGoalDisplay','normBtn');
        }
        if (player.stateOfEnergySpeedrun === 'running' && !player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal)) {
            updateText('energyPointGoalDisplay',('Current Energy Goal: ' + format(player.energyPointGoal,2) + ' Energy Points'));
        }
        else if (player.stateOfEnergySpeedrun === 'failed') {
            updateText('energyPointGoalDisplay',('Speedrun Failed - Click To Reset Speedrun'));
            addClass('energyPointGoalDisplay','normBtn');
        }
        updateText('energyPointDisplay',('You Have ' + format(player.energyPoints,2) + ' Energy Points'));
        updateText('energyPointCrankDisplay',('Gain ' + format(player.energyPointMult,2) + ' Energy Points'));
    }
    updateText('energyPointHeader',(format(player.energyPoints,2) + ' EP'));

    //energy upgrade updates
    if (energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].featuresAllowed[2]) {
        flexElement('energyUpgradeContainer');
    }
    else {
        hideElement('energyUpgradeContainer');
    }
    for (let i = 0; i < energyUpgradeArr.length; i++) {
        energyUpgradeArr[i].update();
        player.energyUpgradeArr[i] = energyUpgradeArr[i].bought;
    }


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

        for (let i = 0; i < prestigeUpgradeArr.length; i++) {
            prestigeUpgradeArr[i].update();
            player.prestigeUpgradeArr[i] = prestigeUpgradeArr[i].bought;
        }

        for (let i = 0; i < energyUpgradeArr.length; i++) {
            player.energyUpgradeArr[i] = energyUpgradeArr[i].bought;
        }

        for (let i = 0; i < energySpeedrunArr.length; i++) {
            energySpeedrunArr[i].updateBtn();
        }

        for (let i = 0; i < energySpeedrunArr.length; i++) {
            energySpeedrunArr[i].displayed = false;
            let unlockedAmount = player.energySpeedrunsUnlocked.toNumber();
            if (unlockedAmount > i) {
                energySpeedrunArr[i].displayed = true;
            }
        }

        for (let i = 0; i < prestigeUpgradeArr.length; i++) {
            prestigeUpgradeArr[i].displayed = false;
            let unlockedAmount = player.prestigeUpgradesUnlocked.toNumber();
            if (unlockedAmount > i) {
                prestigeUpgradeArr[i].displayed = true;
            }
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

    if (energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].maxTimer === false) {
        player.energySpeedrunTimer = false;
    }
    else {
        player.energySpeedrunTimer = energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].timer;
    }
}



//autosave loop
setInterval(slowLoop, 20);
function slowLoop() {
    if (player.autoSave) {
        save();
    }
}


