function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function updateColor (name) {
    document.documentElement.style.setProperty('--' + name,player.colors[name]);
}

function updateText (id, text) {
    document.getElementById(id).textContent = text;
}

function updateContent (id, content) {
    document.getElementById(id).innerHTML = content;
}

function updateStyle (id, styleVal) {
    document.getElementById(id).style = styleVal;
}

function addClass(id, value) {
    document.getElementById(id).classList.add(value);
}

function removeClass(id, value) {
    document.getElementById(id).classList.remove(value);
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}

function flexElement(id) {
    document.getElementById(id).style.display = 'flex';
}

function isSingle (value, text1, text2) {
    if (value.equals(1)) {
        return text1;
    }
    else {
        return text2;
    }
}

function toggleBool(x,y,z) {
    if (y !== undefined) {
        player[y] = !x;
        if (z !== undefined) {
            let value = 'OFF';
            if (!x) {
                value = 'ON';
            }
            updateText(z,value);
        }
    }
    else {
        return !x;
    }
}

function changeBoolDisplay(x,y) {
    if (y !== undefined) {
        let value = 'OFF';
        if (x) {
            value = 'ON';
        }
        updateText(y,value);
    }
}

function pad(n, len) 
{
    s = n.toString();
    if (s.length < len) 
    {
        s = ('0000000000' + s).slice(-len);
    }    
    return s;
}




