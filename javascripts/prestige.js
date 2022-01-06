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
    let speedrunOneInfo = ['Get to 10 EP - Crank','Time Limit: None','(Rewards 1 PP)'];
    let speedrunTwoInfo = ['Get to 1e3 EP - Crank + Generator','Time Limit: 1 Min','(Rewards 10 PP)']
    let speedrunThreeInfo = ['Get to 250 EP - Can\'t Buy Generators','Time Limit: 30 Secs','(Rewards 25 PP)']
    let speedrunTotalArr = [speedrunOneInfo,speedrunTwoInfo,speedrunThreeInfo];
    updateContent('energySpeedrunInfoBoxNum','Displaying: Speedrun ' + num);
    updateContent('energySpeedrunInfoBoxDesc',speedrunTotalArr[num - 1][0]);
    updateContent('energySpeedrunInfoBoxLim',speedrunTotalArr[num - 1][1]);
    updateContent('energySpeedrunInfoBoxReward',speedrunTotalArr[num - 1][2]);
}

function startNewEnergySpeedrun(num) {
    //player.currentEnergySpeedrun = new Decimal(num);
    energySpeedrunArr[num - 1].start();
}

function updatePrestigeUpgradeInfo(num) {
    let prestigeUpgradeInfoArr = ['Unlocks An Auto-Complete Feature', 'Doubles Energy Generators\' Production', 'Start Speedruns With 1 Free Generator', 'Adds An Energy Gain Bonus Based <br> On Total Speedrun Completions'];
    
    updateContent('prestigeUpgradeInfoBoxNum','Displaying: Upgrade ' + num);
    updateContent('prestigeUpgradeInfoBoxDesc',prestigeUpgradeInfoArr[num - 1]);
    if (prestigeUpgradeArr[num - 1].effect !== undefined) {
        updateContent('prestigeUpgradeInfoBoxEffect','Mult Effect: ' + format(prestigeUpgradeArr[num - 1].effect,2) + 'x');
    }
    else {
        updateContent('prestigeUpgradeInfoBoxEffect','Mult Effect: None');
    }
    updateContent('prestigeUpgradeInfoBoxCost','Costs: ' + format(prestigeUpgradeArr[num - 1].cost,2) + ' Prestige Points');
    updateContent('prestigeUpgradeInfoBoxBought','Bought: ' + prestigeUpgradeArr[num - 1].bought);
}

function buyPrestigeUpgrade(num) {
    prestigeUpgradeArr[num - 1].buy();
    updatePrestigeUpgradeInfo(num);
}



