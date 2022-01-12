class building {
    constructor (name, currency, displayed, cost, costMult, costScale, amount) {
        //var pointGen = new building ('pointGen','points',10,10,1.5,0)
        this.name = name;
        this.currency = currency;
        if (this.currency === 'energyPoints') {
            this.currencyPS = 'EP/s';
            this.currencyName = 'Energy Points';
        }
        this.displayed = displayed;
        this.cost = cost;
        this.costMult = costMult;
        this.costScale = costScale;
        this.amount = amount;
        this.freeAmount = new Decimal(0);
    }

    buy () {
        if (energyUpgrade2.bought) {
            this.costScale = new Decimal(1.4);
        }
        else {
            this.costScale = new Decimal(1.5);
        }
        if (player.stateOfEnergySpeedrun === 'running' && (!player.currentEnergySpeedrun.equals(3) || this.name !== 'energyPointGen')) {
            this.cost = this.costScale.pow(this.amount).mul(this.costMult);
            if (player[this.currency].greaterThanOrEqualTo(this.cost)) {
                player[this.currency] = player[this.currency].sub(this.cost);
                this.amount = this.amount.add(1);
            }
        }
    }

    calc() {
        let costSc = this.costScale;
        this.cost = costSc.pow(this.amount).mul(this.costMult);
    }

    update () {
        if (energyUpgrade2.bought) {
            this.costScale = new Decimal(1.4);
        }
        else {
            this.costScale = new Decimal(1.5);
        }

        //calculating free generators
        this.freeAmount = new Decimal(0);
        if (energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].featuresAllowed[1]) {
            if (prestigeUpgrade3.bought) {
                this.freeAmount = this.freeAmount.add(1);
            }
            if (prestigeUpgrade5.bought) {
                this.freeAmount = this.freeAmount.add(prestigeUpgrade5.effect);
            }
        }  

        let costSc = this.costScale;
        this.cost = costSc.pow(this.amount).mul(this.costMult);
        if (this.currency === 'energyPoints') {
            this.generating = ((this.amount).add(this.freeAmount)).mul(player.energyPointMult).mul(player.energyGenMult);
            if (energyUpgrade1.bought) {
                this.generating = new Decimal.mul(this.generating,energyUpgrade1.effect);
            }
            if (energyUpgrade3.bought) {
                this.generating = new Decimal.mul(this.generating,energyUpgrade3.effect);
            }
            if (energyUpgrade4.bought) {
                this.generating = new Decimal.mul(this.generating,energyUpgrade4.effect);
            }
        } 

        if (this.displayed === true) {
            if (!(player[this.currency].greaterThanOrEqualTo(this.cost)) || player.currentEnergySpeedrun.eq(3)) {
                updateStyle((this.name + 'Button'),'color: var(--invalidEdge); background-color: var(--invalidFill); border: 2px solid var(--invalidEdge)');
            }
            else {
                updateStyle((this.name + 'Button'),'color: var(--validEdge); background-color: var(--validFill); border: 2px solid var(--validEdge)');
            }

            flexElement((this.name + 'Button'));
            updateText((this.name + 'SpeedDisplay'),('Generating ' + format(this.generating,2) + ' ' + this.currencyPS));
            updateText((this.name + 'CostDisplay'),('Next Purchase Costs ' + format(this.cost,2) + ' ' + this.currencyName));
            if (this.freeAmount.gte(1)) {
                updateText((this.name + 'AmountDisplay'),('Bought: ' + format(this.amount,0) + ' / Free: ' + format(this.freeAmount)));
            }
            else {
                updateText((this.name + 'AmountDisplay'),('Bought: ' + format(this.amount,0)));
            }
        }
        else {
            hideElement((this.name + 'Button'));
        }
    }
}




//prestige buildings
class energySpeedrun {
    constructor (speedrunNum, energyPointGoal, featuresAllowed, prestigeAward, maxTimer, displayed) {
        //features is an array with the following features mapped to their positions:
        //0: energy point crank, 1: energy point generator
        this.speedrunNum = speedrunNum;
        this.energyPointGoal = energyPointGoal;
        this.featuresAllowed = featuresAllowed;
        this.prestigeAward = prestigeAward;
        this.maxTimer = maxTimer;
        if (this.maxTimer !== false) {
            this.timer = this.maxTimer;
        }
        this.completions = new Decimal("0");
        this.displayed = displayed;
        this.realNum = this.speedrunNum.toNumber();
    }

    start() {
        player.energyPointGoal = this.energyPointGoal;
        player.energyPoints = new Decimal("0");
        player.runningEnergySpeedrun = true;
        player.currentEnergySpeedrun = this.speedrunNum;
        updateText('currentEnergySpeedrunDisplay','Current: Speedrun ' + this.speedrunNum);
        this.timer = this.maxTimer;
        player.stateOfEnergySpeedrun = 'running';
        energyPointGen.amount = new Decimal("0");
        energyPointGen.update();

        for (let i = 0; i < energyUpgradeArr.length; i++) {
            energyUpgradeArr[i].bought = false;
        }
    }

    calc() {
        if (player.stateOfEnergySpeedrun === 'running') {
            if (this.maxTimer !== false) {
                if (this.timer.lessThanOrEqualTo(0)) {
                    energyPointGoalFailed();
                    updateText('energySpeedrunTimer','Speedrun Timer: FAILED');
                }
                else {
                    this.timer = this.timer.sub(1/50);
                    this.reward = energySpeedrunRewards[this.speedrunNum.sub(1)];
                }
            }
        }
    }

    updateBtn() {
        if (this.displayed) {
            flexElement('energySpeedrunBtn' + this.realNum);
        }
        else {
            hideElement('energySpeedrunBtn' + this.realNum);
        }
    }

    update() {
        hideElement('noCurrentSpeedrunDisplay');
        if (player.stateOfEnergySpeedrun === 'running') {
            if (player.currentTab === 'energy') {
                flexElement('energyContainer');
            }

            if (this.featuresAllowed[0]) {
                flexElement('energyPointCrank');
            }
            else {
                hideElement('energyPointCrank');
            }
            if (this.featuresAllowed[1]) {
                energyPointGen.displayed = true;
            }
            else {
                energyPointGen.displayed = false;
            }


            if (this.maxTimer !== false) {
                //console.log('beep')
                if (this.timer.lessThanOrEqualTo(0)) {
                    energyPointGoalFailed();
                    updateText('energySpeedrunTimer','Speedrun Timer: FAILED');
                }
                else {
                    flexElement('energySpeedrunTimer');
                    updateText('energySpeedrunTimer','Speedrun Timer: ' + format(this.timer,2));
                    this.reward = energySpeedrunRewards[this.speedrunNum.sub(1)];
                    updateText('energySpeedrunReward','Completing Now Rewards ' + format(this.reward,2) + ' PP');
                }
            }
            else {
                hideElement('energySpeedrunTimer');
                this.reward = energySpeedrunRewards[this.speedrunNum.sub(1)];
                updateText('energySpeedrunReward','Completing Now Rewards ' + format(this.reward,2) + ' PP');
            }
        }
        else if (player.stateOfEnergySpeedrun === 'none') {
            if (player.currentTab === 'energy') {
                flexElement('noCurrentSpeedrunDisplay');
            }
            hideElement('energyContainer');
        }
    }

    complete() {
        this.reward = energySpeedrunRewards[this.speedrunNum.sub(1)];
        player.prestigePoints = player.prestigePoints.add(this.reward);
        player.energyPoints = new Decimal("0");
        this.completions = this.completions.add(1);
        player.totalEnergySpeedrunCompletions = player.totalEnergySpeedrunCompletions.add(1);
        energyPointGen.amount = new Decimal(0);
        energySpeedrunArr[this.speedrunNum.sub(1)].start();

        if ((this.realNum + 1) > player.energySpeedrunsUnlocked.toNumber() && (this.realNum + 1) <= energySpeedrunArr.length) {
            console.log(this.realNum + 1);
            player.energySpeedrunsUnlocked = new Decimal(this.realNum + 1);
        }

        if (this.realNum === 3 && player.prestigeUpgradesUnlocked.lt(6)) {
            player.prestigeUpgradesUnlocked = new Decimal("6");

            prestigeUpgrade5.displayed = true;
            prestigeUpgrade6.displayed = true;
        }

        if (this.realNum === 4 && player.prestigeUpgradesUnlocked.lt(8)) {
            player.prestigeUpgradesUnlocked = new Decimal("7");

            prestigeUpgrade7.displayed = true;
            //prestigeUpgrade8.displayed = true;
        }

        if (this.realNum === 4) {
            player.energySpeedrun4Completions = player.energySpeedrun4Completions.add(1);
        }
    }
}

class prestigeUpgrade {
    constructor  (num, cost, displayed) {
        this.num = num;
        this.cost = cost;
        this.bought = false;
        this.displayed = displayed;
    }

    update() {
        if (this.displayed) {
            flexElement('prestigeUpgradeBtn' + this.num);
            if (this.bought) {
                updateStyle('prestigeUpgradeBtn' + this.num,'background-color: var(--boughtFill); color: var(--boughtText); border: 2px solid var(--boughtEdge)')
            }
            else if (player.prestigePoints.gte(this.cost)) {
                updateStyle('prestigeUpgradeBtn' + this.num,'color: var(--validText); border: 2px solid var(--validEdge)');
                addClass('prestigeUpgradeBtn' + this.num, 'smallBtn');
            }
            else if (player.prestigePoints.lt(this.cost)) {
                updateStyle('prestigeUpgradeBtn' + this.num,'background-color: var(--invalidFill); color: var(--invalidText); border: 2px solid var(--invalidEdge)')
            }
        }
        else {
            hideElement('prestigeUpgradeBtn' + this.num);
        }
    }

    buy() {
        if (player.prestigePoints.gte(this.cost) && !this.bought) {
            player.prestigePoints = player.prestigePoints.sub(this.cost);
            this.bought = true;
        }
    }

    effectSet(value) {
        this.effect = value;
    }
}



class energyUpgrade {
    constructor  (num, cost, displayed) {
        this.num = num;
        this.cost = cost;
        this.bought = false;
        this.displayed = displayed;
    }

    update() {
        if (this.displayed && energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].featuresAllowed[2]) {
            flexElement('energyUpgradeBtn' + this.num);
            if (this.bought) {
                updateStyle('energyUpgradeBtn' + this.num,'background-color: var(--boughtFill); color: var(--boughtText); border: 2px solid var(--boughtEdge)')
            }
            else if (player.energyPoints.gte(this.cost)) {
                updateStyle('energyUpgradeBtn' + this.num,'color: var(--validText); border: 2px solid var(--validEdge)');
                addClass('energyUpgradeBtn' + this.num, 'smallBtn');
            }
            else if (player.energyPoints.lt(this.cost)) {
                updateStyle('energyUpgradeBtn' + this.num,'background-color: var(--invalidFill); color: var(--invalidText); border: 2px solid var(--invalidEdge)')
            }
        }
        else {
            hideElement('energyUpgradeBtn' + this.num);
        }
    }

    buy() {
        if (player.energyPoints.gte(this.cost) && !this.bought) {
            player.energyPoints = player.energyPoints.sub(this.cost);
            this.bought = true;
        }
    }

    effectSet(value) {
        this.effect = value;
    }
}

