function gainEnergyPoints(amount) {
    if (player.stateOfEnergySpeedrun !== 'failed') {
        player.energyPoints = player.energyPoints.add(amount.mul(player.energyPointMult));
    }
}