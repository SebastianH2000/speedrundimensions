var tabArr = ['energy','prestige','settings','win','tutorial'];

function changeTab(tab) {
    player.currentTab = tab;
    for (let i = 0; i < tabArr.length; i++) {
        if (tabArr[i] !== tab) {
            hideElement(tabArr[i] + 'Container');
            updateStyle(tabArr[i] + 'Btn','margin: 5px; background-color: var(--validFill)');
        }
    }
    flexElement(tab + 'Container');
    if (tab === 'win') {
        updateStyle(tab + 'Btn','margin: 5px; background-color: var(--wonFill); border: solid 2px var(--wonEdge)');
    }
    else {
        updateStyle(tab + 'Btn','margin: 5px; background-color: var(--hoverFill)');
    }
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