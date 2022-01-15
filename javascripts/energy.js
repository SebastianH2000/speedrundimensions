function gainEnergyPoints(amount,clicked) {
    if (clicked !== undefined) {
        if (clicked === 'click') {
            player.manualCranks = player.manualCranks.add(1);
            let manualCrankMult = new Decimal(1);
            if (energyUpgrade7.bought) {
                manualCrankMult = manualCrankMult.mul(10);
            }
            if (energyUpgrade8.bought) {
                manualCrankMult = manualCrankMult.mul(100);
            }
            player.energyPoints = player.energyPoints.add(amount.mul(player.energyPointMult).mul(manualCrankMult));
        }
    }
    else if (player.stateOfEnergySpeedrun !== 'failed') {
        player.energyPoints = player.energyPoints.add(amount.mul(player.energyPointMult));
    }
}