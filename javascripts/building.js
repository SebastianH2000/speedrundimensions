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
        if (player.stateOfEnergySpeedrun === 'running' && (!player.currentEnergySpeedrun.equals(3) || this.name !== 'energyPointGen')) {
            this.cost = this.costScale.pow(this.amount).mul(this.costMult);
            if (player[this.currency].greaterThanOrEqualTo(this.cost)) {
                player[this.currency] = player[this.currency].sub(this.cost);
                this.amount = this.amount.add(1);
            }
        }
    }

    calc() {
        this.generating = ((this.amount).add(this.freeAmount)).mul(player.energyPointMult).mul(player.energyGenMult);
        let costSc = this.costScale;
        this.cost = costSc.pow(this.amount).mul(this.costMult);
    }

    update () {
        if (prestigeUpgrade3.bought && energySpeedrunArr[player.currentEnergySpeedrun.sub(1)].featuresAllowed[1]) {
            this.freeAmount = new Decimal(1);
        }
        else {
            this.freeAmount = new Decimal(0);
        }

        let costSc = this.costScale;
        this.cost = costSc.pow(this.amount).mul(this.costMult);
        if (this.currency === 'energyPoints') {
            this.generating = ((this.amount).add(this.freeAmount)).mul(player.energyPointMult).mul(player.energyGenMult);
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
    constructor (speedrunNum, energyPointGoal, featuresAllowed, prestigeAward, maxTimer) {
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
            else if (player.prestigePoints.lte(this.cost)) {
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
