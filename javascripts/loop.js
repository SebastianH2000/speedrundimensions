document.addEventListener("DOMContentLoaded", function () {
    let currentTime = Date.now();
    setInterval(mainLoop, 20);
    //setInterval(slowLoop, 1000);
    let elapsedTime = Date.now() - currentTime;

    function mainLoop() {
        elapsedTime += Date.now() - currentTime;
        currentTime = Date.now();
        if (elapsedTime > 120000) { elapsedTime = 120000 };
        while (elapsedTime > 20) {
            elapsedTime -= 20;
            //do stuff
            mainGameLoop();
        }
        updateDisplay();
    }
});

let autoCrankTimer = 0.2;

function mainGameLoop() {
    player.timeTimer = player.timeTimer.add(0.02);
    if (!player.hasWon) {
        player.winTimer = player.winTimer.add(0.02);
    }
    energyUpgrade1.effectSet(new Decimal(new Decimal(1.05).pow(energyPointGen.amount)));
    energyUpgrade4.effectSet(player.prestigeBoost);
    energyUpgrade5.effectSet(Decimal.max(Decimal.log10(Decimal.max(player.totalEnergySpeedrunCompletions,1)),1));
    energyUpgrade6.effectSet(energyPointCrankMult);

    prestigeUpgrade2.effectSet(new Decimal("2"));
    prestigeUpgrade4.effectSet(Decimal.max(Decimal.log10(Decimal.max(player.totalEnergySpeedrunCompletions,1)),1));
    prestigeUpgrade5.effectSet(Decimal.floor(Decimal.add(Decimal.log10(new Decimal.max(player.prestigePoints,1)),1)));
    energySpeedrunRewards = [1,10,25,1000,10000,1000000];
    player.prestigeBoost = Decimal.add(Decimal.log10(new Decimal.max(player.prestigePoints,1)),1);

    //energy boost
    //energy breaks into negative trillions after buying energy boost and going into speedruns 2-4
    prestigeUpgrade6.effectSet(Decimal.add(Decimal.log10(new Decimal.max(player.energyPoints,1)),1));
    prestigeUpgrade7.effectSet(Decimal.add(Decimal.div(Decimal.log10(new Decimal.max(player.energySpeedrun4Completions,1)),2),1));
    prestigeUpgrade12.effectSet(Decimal.add(Decimal.div(Decimal.log10(new Decimal.max(player.manualCranks,1)),2),1));
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
        player.energyPointMult = Decimal.mul(prestigeUpgrade7.effect,player.energyPointMult);
    }
    if (prestigeUpgrade12.bought) {
        player.energyPointMult = Decimal.mul(prestigeUpgrade12.effect,player.energyPointMult);
    }
    if (energyUpgrade5.bought) {
        player.energyPointMult = Decimal.mul(energyUpgrade5.effect,player.energyPointMult);
    }
    if (prestigeUpgrade8.bought && (player.currentEnergySpeedrun.toNumber() === 6 || player.currentEnergySpeedrun.toNumber() === 5 || player.currentEnergySpeedrun.toNumber() === 4 || player.currentEnergySpeedrun.toNumber() === 2)) {
        flexElement('toggleEnergyGeneratorAutobuyerBtn');
        if (player.energyGeneratorAutobuyer && energyPointGen.amount.lt(player.energyGeneratorAutobuyerVal)) {
            energyPointGen.buy();
        }
    }
    else {
        hideElement('toggleEnergyGeneratorAutobuyerBtn');
        player.energyGeneratorAutobuyer = false;
    }
    if (prestigeUpgrade9.bought) {
        energyPointCrankMult = Decimal.max(energyPointGen.amount,1).mul(5);
    }
    else {
        energyPointCrankMult = new Decimal("1");
    }
    if (energyUpgrade6.bought) {
        energyPointCrankMult = Decimal.pow(energyPointCrankMult,2);
    }
    prestigeUpgrade9.effectSet(energyPointCrankMult);
    if (prestigeUpgrade10.bought) {
        flexElement('autoCrankDisplay');
        if (player.autoCrank) {
            if (autoCrankTimer <= 0) {
                gainEnergyPoints(new Decimal(1).mul(energyPointCrankMult));
                autoCrankTimer = 0.2;
            }
            autoCrankTimer -= 1/50;
        }
        else {
            autoCrankTimer = 0.2;
        }
    }
    else {
        hideElement('autoCrankDisplay');
        player.autoCrank = false;
        autoCrankTimer = 0.2;
    }
    if (prestigeUpgrade11.bought && player.currentTab === 'energy') {
        energyUpgrade5.displayed = true;
        energyUpgrade6.displayed = true;
        energyUpgrade7.displayed = true;
        energyUpgrade8.displayed = true;
    }
    else {
        energyUpgrade5.displayed = false;
        energyUpgrade6.displayed = false;
        energyUpgrade7.displayed = false;
        energyUpgrade8.displayed = false;
    }


    if (player.autoCompleteEnergySpeedrun && player.currentEnergySpeedrun.toNumber() !== 6) {
        if (player.energyPoints.gte(player.energyPointGoal)) {
            energyPointGoalCompleted();
        }
    }

    if (prestigeUpgrade2.bought) {
        player.energyGenMult = new Decimal(2);
    }

    //energy gen calc
    energyPointGen.update();
    if (player.stateOfEnergySpeedrun === 'running') {
        gainEnergyPoints(energyPointGen.generating.div(50).div(player.energyPointMult));
        player.energyPointGenAmount = energyPointGen.amount;
    }

    let energyGeneratorAutobuyerAmountTemp = document.getElementById("energyGeneratorAutobuyerAmountInput").value;
    if (energyGeneratorAutobuyerAmountTemp.length > 0) {
        player.energyGeneratorAutobuyerVal = new Decimal(parseInt(energyGeneratorAutobuyerAmountTemp));
        updateText("energyGeneratorAutobuyerAmountDisplay",'(Buys Until You\'ve Reached ' + format(parseInt(energyGeneratorAutobuyerAmountTemp),0) + ' Generators)');
    }
    else {
        player.energyGeneratorAutobuyerVal = new Decimal("0");
        updateText("energyGeneratorAutobuyerAmountDisplay",'(Buys Until You\'ve Reached 0 Generators)');
    }
}

document.getElementById('zoomSlider').oninput = function() {
    updateText('zoomDisplay','Scaling: ' + (document.getElementById('zoomSlider').value/100) + 'x');
}

function zoomSliderChange() {
    player.zoomAmount = document.getElementById('zoomSlider').value/100;
}

function resetScale() {
    player.zoomAmount = 1;
    document.getElementById('zoomSlider').value = '100';
}

function updateDisplay() {
    if (player.zoomAmount*100 === document.getElementById('zoomSlider').value * 1) {
        updateText('zoomDisplay','Scaling: ' + player.zoomAmount + 'x');
    }



    if (player.currentTab === 'win') {
        let timeTimerDuration = player.timeTimer.toNumber();
        let d = Math.floor(timeTimerDuration / 86400);
        let h = Math.floor(timeTimerDuration % 86400 / 3600);
        let m = Math.floor(timeTimerDuration % 3600 / 60);
        let s = Math.floor(timeTimerDuration % 3600 % 60);
        let ms = (timeTimerDuration % 1).toFixed(3);
        updateText('timeTimerDisplay',d + 'd ' + h + 'h ' + m + 'm ' + s + 's ' + pad((ms * 1000),3) + 'ms');
        let winTimerDuration = player.winTimer.toNumber();
        let wind = Math.floor(winTimerDuration / 86400);
        let winh = Math.floor(winTimerDuration % 86400 / 3600);
        let winm = Math.floor(winTimerDuration % 3600 / 60);
        let wins = Math.floor(winTimerDuration % 3600 % 60);
        let winms = (winTimerDuration % 1).toFixed(3);
        updateText('winTimerDisplay',wind + 'd ' + winh + 'h ' + winm + 'm ' + wins + 's ' + pad((winms * 1000),3) + 'ms');
    }


    if (player.guideRevealed) {
        flexElement('guideContainer');
    }
    else {
        hideElement('guideContainer');
    }

    for (const key in player.colors) {
        updateColor(`${key}`);
    }
    player.colors['wonFill'] = hslToHex((player.timeTimer % 360)*10,100,30);
    player.colors['wonText'] = hslToHex((player.timeTimer % 360)*10,100,50);
    player.colors['wonEdge'] = hslToHex((player.timeTimer % 360)*10,100,70);

    if (player.hasWon) {
        flexElement('winTab');
    }
    else {
        hideElement('winTab');
    }

    if (energySpeedrunArr[player.currentEnergySpeedrun.sub(1).toNumber()].featuresAllowed[1] && player.currentTab === 'energy') {
        energyPointGen.displayed = true;
        energyPointGen.update();
    }


    //energy updates
    if (player.currentTab === 'energy') {
        if (player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal) && player.currentEnergySpeedrun.toNumber() === 6) {
            addClass('energyPointGoalDisplay','normBtn');
            updateText('energyPointGoalDisplay','You Win!');
        }
        else {
        if (player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal) && player.stateOfEnergySpeedrun === 'running' && (!player.autoCompleteEnergySpeedrun || player.currentEnergySpeedrun.toNumber() === 6)) {
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
        }
        updateText('energyPointDisplay',('You Have ' + format(player.energyPoints,2) + ' Energy Points'));
        let manualCrankMult = new Decimal(1);
        if (energyUpgrade7.bought) {
            manualCrankMult = manualCrankMult.mul(10);
        }
        if (energyUpgrade8.bought) {
            manualCrankMult = manualCrankMult.mul(100);
        }
        updateText('energyPointCrankDisplay',('Gain ' + format(player.energyPointMult.mul(energyPointCrankMult).mul(manualCrankMult),2) + ' Energy Points'));
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
    document.getElementById("gameWindow").style.transform = "scale(" + x/1200*player.zoomAmount + ")";

    if (energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].maxTimer === false) {
        player.energySpeedrunTimer = false;
    }
    else {
        player.energySpeedrunTimer = energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].timer;
    }

    if (player.autoSave) {
        updateText('settingsTabHeader','Auto-Save: ON');
    }
    else {
        updateText('settingsTabHeader','Auto-Save: OFF');
    }
}



//autosave loop
setInterval(slowLoop, 20);
function slowLoop() {
    if (player.autoSave) {
        save();
    }
}


