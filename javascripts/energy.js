function gainEnergyPoints(amount) {
    //player.energyPoints = new Decimal.times(player.energyPointMult,(player.energyPoints.add(amount)));
    if (player.stateOfEnergySpeedrun !== 'failed') {
        player.energyPoints = player.energyPoints.add(amount.mul(player.energyPointMult));
    }
}