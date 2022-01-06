var tabArr = ['energy','prestige','settings'];

function changeTab(tab) {
    player.currentTab = tab;
    for (let i = 0; i < tabArr.length; i++) {
        if (tabArr[i] !== tab) {
            hideElement(tabArr[i] + 'Container');
        }
    }
    flexElement(tab + 'Container');
}

/*function changeDisplayedTab(tab) {
    player.currentTab = tab;
    for (let i = 0; i < tabArr.length; i++) {
        if (tabArr[i] !== tab) {
            hideElement(tabArr[i] + 'Container');
        }
    }
    flexElement(tab + 'Container');
}*/