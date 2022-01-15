function completeEnergyPointGoal() {
    if (player.stateOfEnergySpeedrun === 'failed') {
        //player.runningEnergySpeedrun = false;
        energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].start();
    }
    else if (player.energyPoints.greaterThanOrEqualTo(player.energyPointGoal)) {
        energyPointGoalCompleted();
    }
}

function energyPointGoalCompleted() {
    if (player.isFirstRun) {
        player.isFirstRun = false;
        flexElement('prestigeTab');
        changeTab('prestige');
        player.energyPoints = new Decimal(0);
    }
    energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].complete();
};

function energyPointGoalFailed() {
    player.stateOfEnergySpeedrun = 'failed';
}

function updateEnergySpeedrunInfo(num) {
    let speedrunOneInfo = ['Features Allowed: Crank', 'Get to 10 EP','Time Limit: None','(Rewards 1 PP)'];
    let speedrunTwoInfo = ['Features Allowed: Crank + Generators', 'Get to 1e3 EP','Time Limit: 1 Min','(Rewards 10 PP)'];
    let speedrunThreeInfo = ['Features Allowed: Free Generators', 'Get to 250 EP','Time Limit: 30 Secs','(Rewards 25 PP)'];
    let speedrunFourInfo = ['Features Allowed: Generators + Upgrades', 'Get to 1e6 EP','Time Limit: 1 Min','(Rewards 1e3 PP)'];
    let speedrunFiveInfo = ['Features Allowed: Crank + Generators', 'Get to 1e6 EP','Time Limit: 1 Min','(Rewards 1e4 PP)'];
    let speedrunSixInfo = ['Features Allowed: EVERYTHING', 'Get to 1e9 EP','Time Limit: 2 Mins','(Reward: You Win)'];
    let speedrunTotalArr = [speedrunOneInfo,speedrunTwoInfo,speedrunThreeInfo,speedrunFourInfo,speedrunFiveInfo,speedrunSixInfo];
    updateContent('energySpeedrunInfoBoxNum','Displaying: Speedrun ' + num);
    updateContent('energySpeedrunInfoBoxFeatures',speedrunTotalArr[num - 1][0]);
    updateContent('energySpeedrunInfoBoxDesc',speedrunTotalArr[num - 1][1]);
    updateContent('energySpeedrunInfoBoxLim',speedrunTotalArr[num - 1][2]);
    updateContent('energySpeedrunInfoBoxReward',speedrunTotalArr[num - 1][3]);
}

function startNewEnergySpeedrun(num) {
    //player.currentEnergySpeedrun = new Decimal(num);
    energySpeedrunArr[num - 1].start();
    changeTab('energy');
}

function updatePrestigeUpgradeInfo(num) {
    let prestigeUpgradeInfoArr = ['Unlocks An Auto-Complete Feature', 'Doubles The Production Of <br> The Energy Generators', 'Start Speedruns With 1 Free Generator', 'Adds An Energy Gain Bonus Based <br> On Total Speedrun Completions', 'Every Power Of 10 PP <br> Gives You 1 Free Generator', 'Your Energy Points Create <br> A Boost To Energy Gain','Your Completions Of Energy Speedrun 4 <br> Create A Boost To Energy Gain','Unlocks An Energy Generator Autobuyer','Creates A Boost To Energy Crank <br> Based On The Amount Of <br> Energy Generators','Unlocks Automation For The <br> Energy Crank','Unlocks 4 More Energy Upgrades','Your Manual Energy Crank Clicks <br> Create A Boost To Energy Gain'];
    
    updateContent('prestigeUpgradeInfoBoxNum','Displaying: Upgrade ' + num);
    updateContent('prestigeUpgradeInfoBoxDesc',prestigeUpgradeInfoArr[num - 1]);
    if (prestigeUpgradeArr[num - 1].effect !== undefined) {
        updateContent('prestigeUpgradeInfoBoxEffect','Mult Effect: ' + format(prestigeUpgradeArr[num - 1].effect,2) + 'x');
    }
    else {
        updateContent('prestigeUpgradeInfoBoxEffect','Mult Effect: None');
    }
    if (num === 5) {
        updateContent('prestigeUpgradeInfoBoxEffect','Grants ' + format(prestigeUpgrade5.effect,0) + ' Free Generators');
    }
    updateContent('prestigeUpgradeInfoBoxCost','Costs: ' + format(prestigeUpgradeArr[num - 1].cost,2) + ' Prestige Points');
    updateContent('prestigeUpgradeInfoBoxBought','Bought: ' + prestigeUpgradeArr[num - 1].bought);
}

function buyPrestigeUpgrade(num) {
    prestigeUpgradeArr[num - 1].buy();
    updatePrestigeUpgradeInfo(num);
}

function updateEnergyUpgradeInfo(num) {
    let energyUpgradeInfoArr = ['Every Bought Generator Boosts <br> All The Energy Generators By 1.05x', 'Reduces The Cost Scaling <br> Of Energy Generators', 'Doubles The Production Of <br> The Energy Generators', 'Squares The Prestige Boost','Squares Prestige Upgrade 4\'s Effect','Squares Prestige Upgrade 9\'s Effect','Manual Crank Clicks Are <br> 10x More Powerful','Manual Crank Clicks Are <br> 100x More Powerful!!!'];
    
    updateContent('energyUpgradeInfoBoxNum','Displaying: Energy Upgrade ' + num);
    updateContent('energyUpgradeInfoBoxDesc',energyUpgradeInfoArr[num - 1]);
    if (energyUpgradeArr[num - 1].effect !== undefined) {
        updateContent('energyUpgradeInfoBoxEffect','Mult Effect: ' + format(energyUpgradeArr[num - 1].effect,2) + 'x');
    }
    else {
        updateContent('energyUpgradeInfoBoxEffect','Mult Effect: None');
    }
    if (num === 2) {
        updateContent('energyUpgradeInfoBoxEffect','(From 1.5x To 1.4x)');
    }
    else if (num === 4) {
        updateContent('energyUpgradeInfoBoxEffect','(From ' + format(player.prestigeBoost,2) + "x To " + format(player.prestigeBoost.pow(2),2) + "x)");
    }
    else if (num === 5) {
        updateContent('energyUpgradeInfoBoxEffect','(From ' + format(prestigeUpgrade4.effect,2) + "x To " + format(prestigeUpgrade4.effect.pow(2),2) + "x)");
    }
    else if (num === 6) {
        updateContent('energyUpgradeInfoBoxEffect','(From ' + format(prestigeUpgrade9.effect,2) + "x To " + format(prestigeUpgrade9.effect.pow(2),2) + "x)");
    }
    updateContent('energyUpgradeInfoBoxCost','Costs: ' + format(energyUpgradeArr[num - 1].cost,2) + ' Energy Points');
    updateContent('energyUpgradeInfoBoxBought','Bought: ' + energyUpgradeArr[num - 1].bought);
}

function buyEnergyUpgrade(num) {
    energyUpgradeArr[num - 1].buy();
    updateEnergyUpgradeInfo(num);
}



