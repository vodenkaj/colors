const palleteContainer = document.querySelector('.picker-container');
const navBar = document.querySelector('.tools');
let lastExtendButton, lastShade, currentColors = [];
window.onload = () => {

    const path = window.location.pathname.slice(1).replace(/-/g, '');
    window.history.replaceState({}, null, '');
    if (path == 'generator') for (var i = 0; i < 3; i++) addColor();
    else {
        const colorsHEX = path.match(/.{1,6}/g).reverse();
        const n = colorsHEX.length;
        for (let i = 0; i < n; i++) addColor(null, -1, colorsHEX);
    }
}

document.onkeydown = createColors;
palleteContainer.addEventListener('mouseover', function(e) {
    if (e.target && (e.target.className == 'side-div right' || e.target.className == 'add-color right')) {
        e.target.parentElement.style.zIndex = 2;
        lastExtendButton = e.target;
    } else if (lastExtendButton && lastExtendButton != e.target) {
        lastExtendButton.parentElement.style.zIndex = 1;
        lastExtendButton = null;
    }
})
palleteContainer.addEventListener('mouseup', function(e) {
    if (e.target.classList.contains('add-color')) {
        if (e.target.classList.contains('left')) addColor(e, 0);
        else addColor(e, 1);
    }
    selectShade(e);
    lockColor(e);
    removeColor(e);
    showColorShades(e);
});
navBar.addEventListener('mouseup', (e) => {
    openModal(e);
})

function getColorsFromURL(colorsHEX){
    for (let i = 0; i < colorsHEX.length; i++) addColor();
}

function createShades(rootDiv) {
    const baseColor = rootDiv.parentElement.style.backgroundColor.replace(/[^0-9,]/g, '').split(',').map(x => +x);
    let color, rgb, grayScale;
    const offsets = generateShades(baseColor[0], baseColor[1], baseColor[2]);
    for (var i = 0; i < 26; i++) {
        shadeBtn = rootDiv.children[i];
        shadeHex = shadeBtn.children[0];
        if (i < offsets[1].length) {
            color = RGBToHex(offsets[1][i]);
            rgb = offsets[1][i];
        } else {
            color = RGBToHex(offsets[0][i - offsets[1].length]);
            rgb = offsets[0][i - offsets[1].length];
        }
        grayScale = getGrayScale(rgb);
        if (grayScale > 0.5) shadeHex.style.color = '#0F2235';
        else shadeHex.style.color = 'white';
        shadeBtn.style.background = color;
        shadeHex.textContent = color.slice(1).toUpperCase();
    }
}

function createColors(e = null) {
    if (e instanceof KeyboardEvent && e.key != ' ') return;
    const pickers = palleteContainer.children;
    for (var i = 0; i < pickers.length; i++) {
        if (!pickers[i].children[5].children[0].children[2].classList.contains('locked')) {
            generateColor(pickers[i]);
            const color = pickers[i].children[5].children[1].innerText;
            createShades(pickers[i].children[0]);
        }
    }
    updateCurrentColors();
    updateHTML();
}

function generateColor(element, customColors=null) {
    let color;
    if (!customColors) {
       color = "#000000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
        }).toUpperCase();
    }
    else color = '#' + customColors.pop()
    element.children[1].value = color;
    element.children[5].children[1].innerText = color.slice(1);
    element.style.background = color;
    rgb = HexToRGB(parseInt(color.slice(1), 16));
    if (getGrayScale(rgb) > 0.5) element.children[5].style.color = '#0F2235';
    else element.children[5].style.color = 'white';
}

function generateShades(r, g, b) {
    const firstHalf = Math.round(((1.333 * (r / 255) + 1.5 * (g / 255) + 1.16 * (b / 255)) * 10) / 2);
    const secondHalf = 26 - firstHalf;
    const valuesUp = [],
        valuesDown = [],
        lighterRGB = [];
    [r, g, b].forEach((x) => lighterRGB.push((255 - x) / secondHalf));
    for (var i = firstHalf; i >= 1; i--) {
        valuesDown.push([(r / firstHalf) * i, (g / firstHalf) * i, (b / firstHalf) * i]);
    }
    for (var i = secondHalf; i >= 1; i--) {
        valuesUp.push([r + (lighterRGB[0] * i), g + (lighterRGB[1] * i), b + (lighterRGB[2] * i)]);
    }
    return [valuesDown, valuesUp];
}

function selectShade(e) {
    if (e.target.className == 'shades-splits') {
        const color = e.target.children[0].textContent.toUpperCase();
        rgb = HexToRGB(parseInt(color, 16));
        e.target.parentElement.parentElement.style.background = '#' + color;
        e.target.parentElement.parentElement.children[5].children[1].innerText = color;
        if (getGrayScale(rgb) > 0.5) e.target.parentElement.parentElement.children[5].style.color = '#0F2235';
        else e.target.parentElement.parentElement.children[5].style.color = 'white';
        e.target.parentElement.style.visibility = 'hidden';
        lastShade.style.removeProperty('visibility');
        updateCurrentColors();
    }
}

function showColorShades(e) {
    if (e.target.className == 'shades') {
        const color = e.target.parentElement.parentElement.children[1].innerText;
        e.target.parentElement.parentElement.parentElement.children[0].childNodes.forEach((x) => {
            if (x.children[0].textContent == color) {
                lastShade = x.children[0];
                lastShade.style.visibility = 'visible';
            }
        })
        e.target.parentElement.parentElement.parentElement.children[0].style.visibility = 'visible';
    }
}

function lockColor(e) {
    if (e.target.classList.contains('lock')) {
        parent = e.target;
        if (parent.classList.contains('locked')) parent.classList.remove('locked');
        else parent.classList.add('locked');
    }
}

function addColor(e, insert = -1, customColors = null) {
    const rootDiv = document.createElement('div');
    rootDiv.classList.add('split');
    const sideDivLeft = document.createElement('div');
    sideDivLeft.classList.add('side-div');
    sideDivLeft.classList.add('left');
    const sideDivRight = document.createElement('div');
    sideDivRight.classList.add('side-div');
    sideDivRight.classList.add('right');
    const shadesDiv = document.createElement('div');
    shadesDiv.classList.add('shades-div');
    for (let i = 1; i <= 26; i++) {
        let shadeBtn = document.createElement('div');
        let shadeHex = document.createElement('span');
        shadeHex.classList.add('shade-hex');
        shadeBtn.appendChild(shadeHex);
        shadeBtn.classList.add('shades-splits');
        shadesDiv.appendChild(shadeBtn);
    }
    const sideBtnLeft = document.createElement('button');
    sideBtnLeft.classList.add('add-color');
    sideBtnLeft.classList.add('left');
    const sideBtnRight = document.createElement('button');
    sideBtnRight.classList.add('add-color');
    sideBtnRight.classList.add('right');
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');
    const shadesBtn = document.createElement('button');
    shadesBtn.classList.add('shades');
    const lockBtn = document.createElement('button');
    lockBtn.classList.add('lock');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove');
    const colorCode = document.createElement('a');
    palleteContainer.appendChild(rootDiv);
    optionsDiv.appendChild(buttonsContainer);
    buttonsContainer.appendChild(removeBtn);
    buttonsContainer.appendChild(shadesBtn);
    buttonsContainer.appendChild(lockBtn);
    optionsDiv.appendChild(colorCode);
    rootDiv.appendChild(shadesDiv);
    rootDiv.appendChild(sideDivLeft);
    rootDiv.appendChild(sideDivRight);
    rootDiv.appendChild(sideBtnLeft);
    rootDiv.appendChild(sideBtnRight);
    rootDiv.appendChild(optionsDiv);
    if (insert == 0) palleteContainer.insertBefore(rootDiv, e.target.parentElement);
    else if (insert == 1) palleteContainer.insertBefore(rootDiv, e.target.parentElement.nextSibling);
    generateColor(rootDiv, customColors);
    adjustWidth();
    createShades(shadesDiv);
    updateCurrentColors();
}

function updateHTML(){
    window.history.pushState({}, null, currentColors.map(x => x[0]).join('-').replace(/#/g, ''));
}

function removeColor(e) {
    if (e.target.className == 'remove' && palleteContainer.children.length > 1) {
        const parent = e.target.parentElement.parentElement.parentElement;
        parent.remove();
        adjustWidth();
        updateCurrentColors();
    }
}

function adjustWidth() {
    const n = palleteContainer.children.length;
    const newWidth = 100 / n;
    for (var i = 0; i < n; i++) {
        palleteContainer.children[i].style.width = newWidth + '%';
    }
}

function updateCurrentColors(){
    currentColors = [];
    for (let i = 0; i < palleteContainer.childNodes.length; i++){
        currentColors.push([
            RGBToHex(palleteContainer.childNodes[i].style.backgroundColor.replace(/[^0-9,]/g, '').split(',').map(x => +x)).toUpperCase(),
            palleteContainer.childNodes[i].children[5].style.color]);
    }
    updateHTML();
}