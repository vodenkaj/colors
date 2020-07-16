const colorPicker = document.querySelector('.picker-container');
const modalContainer = document.querySelector('.modal-container');
const navBar = document.querySelector('.tools');
let lastExtendButton, lastShade, lastModul, currentColors = [];
window.onload = () => {
    for (var i = 0; i < 3; i++) addColor();
}
document.onkeydown = createColors;
colorPicker.addEventListener('mouseover', function(e) {
    if (e.target && (e.target.className == 'side-div right' || e.target.className == 'add-color right')) {
        e.target.parentElement.style.zIndex = 2;
        lastExtendButton = e.target;
    } else if (lastExtendButton && lastExtendButton != e.target) {
        lastExtendButton.parentElement.style.zIndex = 1;
        lastExtendButton = null;
    }
})
colorPicker.addEventListener('mouseup', function(e) {
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
modalContainer.addEventListener('mouseup', (e) => {
    exportColors(e);
    savePallete(e);
    copyToClipboard(e);
})

function copyToClipboard(e) {
    switch (e.target.id) {
        case 'copy-css':
            const content = document.querySelector('.code-container');
            const tempElement = document.createElement('textarea');
            tempElement.value = content.textContent;
            document.body.appendChild(tempElement);
            tempElement.select();
            document.execCommand('copy');
            tempElement.remove();
            break;
    }
}

function openModal(e) {
    switch (e.target.id){
        case 'export':
            modalContainer.style.visibility = 'visible';
            modalContainer.children[0].children[0].style.display = 'initial';
            modalContainer.children[0].children[0].style.visibility = 'visible';
            colorPicker.style.pointerEvents = 'none';
            break;
        case 'save':
            isUserLoggedIn();
            break;
    }
}

function isUserLoggedIn(){
    const user = document.getElementById('user');
    if (user){
        modalContainer.style.visibility = 'visible';
        modalContainer.children[0].children[3].style.display = 'initial';
        modalContainer.children[0].children[3].style.visibility = 'visible';
        colorPicker.style.pointerEvents = 'none';
        document.getElementById('color-data').value = JSON.stringify(currentColors);
        console.log(document.getElementById('color-data').value);
    }
    else {
        signIn();
    }
}

function savePallete(e){
    switch(e.target.id){
        case 'close':
            modalContainer.style.visibility = 'hidden';
            modalContainer.children[0].children[3].style.display = 'none';
            modalContainer.children[0].children[3].style.visibility = 'hidden';
            colorPicker.style.pointerEvents = 'all';
            break;
    }
}

function exportColors(e) {
    switch (e.target.id) {
        case 'close':
            modalContainer.style.visibility = 'hidden';
            modalContainer.children[0].children[0].style.display = 'none';
            if (lastModul){
                lastModul.style.display = 'none';
                lastModul.style.visibility = 'hidden';
            }
            
            colorPicker.style.pointerEvents = 'all';
            break;
        case 'css-export':
            lastModul = modalContainer.children[0].children[1];
            modalContainer.children[0].children[0].style.display = 'none';
            lastModul.style.display = 'initial';
            lastModul.style.visibility = 'visible';
            exportToCSS();
            break;
        case 'image-export':
            lastModul = modalContainer.children[0].children[2];
            modalContainer.children[0].children[0].style.display = 'none';
            lastModul.style.display = 'initial';
            lastModul.style.visibility = 'visible';
            exportToImage();
            break;
        case 'ase-export':
            modalContainer.style.visibility = 'hidden';
            modalContainer.children[0].children[0].style.display = 'none';
            colorPicker.style.pointerEvents = 'all';
            exportToASE();
            break;
    }
}

function exportToASE() {

    const head = new Uint16Array([0x4153, 0x4546, 0x0001,0x0000, 0x0000, 0x00 + currentColors.length]);
    head.map((binary, i) => head[i] = swapEndian(binary));
    const rgbLine = new Uint16Array([0x5247, 0x4220]);
    rgbLine.map((binary, i) => rgbLine[i] = swapEndian(binary));
    const name = [];
    currentColors.forEach((color) => name.push(convertStringToUTF8ByteArray(color)));
    
    let bytes = new Uint16Array((2 + (currentColors.length*11))*2);
    bytes.set(head);
    for (let i = 0; i < currentColors.length; i++){
        let tempArr = new Uint16Array(21);
        tempArr[0] = swapEndian(0x0001);
        tempArr[2] = swapEndian(0x0024);
        tempArr[3] = swapEndian(0x0008);
        for (let k = 0; k < 8; k++){
            tempArr[k+4] = (name[i][k] << 8);
        }

        const rgb = HexToRGB(parseInt(currentColors[i].slice(1), 16));

        tempArr.set(rgbLine,12);
        for (let j = 0; j < 3; j++){
            // % of rgb color to binary
            let binary = (rgb[j]/255).toString(2).slice(2);
            
            // finding exponent
            let idx = -1;
            if (rgb[j] != 255){
                for (let i = 0; i < binary.length; i++){
                    if (binary[i] === '1') break;
                    else idx--;
                }
            }
            // in case that exported color is #ffffff
            else{
                idx = 0;
                binary = '000000000000000000000000';
            }

            // moving binary string, so '1' is at start
            binary = binary.slice(Math.abs(idx), 23 + Math.abs(idx));

            // getting bias and converting it into binary
            let bias = (127+idx).toString(2);

            // there is the final hex format
            let s = ((parseInt(bias + binary , 2))).toString(16);
            let s1 = swapEndian(parseInt(s.slice(0, 4), 16));
            let s2 = swapEndian(parseInt(s.slice(4, 8), 16));

            // adding color to the rgb line file
            tempArr[tempArr.length+(-7+j*2)] = s1;
            tempArr[tempArr.length+(-6+j*2)] = s2;
        }
        bytes.set(tempArr, head.length + (21*i));
    }
    const blob = new Blob([bytes]);
    document.getElementById('ase-export').href = URL.createObjectURL(blob);
}

function convertStringToUTF8ByteArray(str) {
    const final = new Uint16Array(str.length);
    const arr = final.map((byte, i)=> str.charCodeAt(i));

    return arr;
}

function swapEndian(val){
    return ((val & 0xFF) << 8)
           | ((val >> 8) & 0xFF);
}

function exportToImage() {
    const width = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = 1080;
    const context = canvas.getContext('2d');
    const widthColor= width / currentColors.length;
    let xPos = 0;
    currentColors.forEach((color) => {
        context.fillStyle = color;
        context.fillRect(xPos, 0, widthColor, 1080);
        xPos += widthColor;
    });
    document.getElementById('download-image').href = canvas.toDataURL();
    canvas.remove();
}

function exportToCSS() {
    const colorsRGB = [],
        colorsHEX = [],
        colorsSCSSRGB = [];
    colorPicker.childNodes.forEach((x) => {
        let cleanRGB = x.style.backgroundColor.replace(/[^0-9,]/g, '').split(',').map(x => +x);
        let colorName = ntc.name(RGBToHex(cleanRGB))[1].replace(' ', '-');
        colorsRGB.push(rgbToCSS(x.style.backgroundColor, colorName));
        colorsHEX.push(RGBToSCSSHex(cleanRGB, colorName));
        colorsSCSSRGB.push('$' + colorsRGB[colorsRGB.length-1].slice(2));
    });
    codeElement = lastModul.children[2].children[0].children[0];
    codeElement.innerText = '/* CSS */' + '\n';
    codeElement.innerText += colorsRGB.join('\n');
    codeElement.innerText += '\n' + '\n' + '/* SCSS HEX */' + '\n';
    codeElement.innerText += colorsHEX.join('\n');
    codeElement.innerText += '\n' + '\n' + '/* SCSS RGB */' + '\n';
    codeElement.innerText += colorsSCSSRGB.join('\n');
    document.getElementById('download-css').href = 'data:text/txt;base64,' + btoa(codeElement.innerText);
}

function RGBToSCSSHex(rgb, name) {
    return `$${name}: ${RGBToHex(rgb)};`;
}

function rgbToCSS(rgb, name) {
    return `--${name}: ${rgb};`;
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
    const pickers = colorPicker.children;
    for (var i = 0; i < pickers.length; i++) {
        if (!pickers[i].children[5].children[0].children[2].classList.contains('locked')) {
            generateColor(pickers[i]);
            createShades(pickers[i].children[0]);
            let color = pickers[i].children[5].children[1].innerText;
            if (i > currentColors.length) currentColors.push('#'+color)
            else currentColors[i] = '#'+color;
        }
    }
}

function generateColor(element) {
    const color = "#000000".replace(/0/g, function() {
        return (~~(Math.random() * 16)).toString(16);
    }).toUpperCase();
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
        setCurrentColor('#' + e.target.parentElement.parentElement.children[5].children[1].innerText, '#'+color);
        e.target.parentElement.parentElement.style.background = '#' + color;
        e.target.parentElement.parentElement.children[5].children[1].innerText = color;
        if (getGrayScale(rgb) > 0.5) e.target.parentElement.parentElement.children[5].style.color = '#0F2235';
        else e.target.parentElement.parentElement.children[5].style.color = 'white';
        e.target.parentElement.style.visibility = 'hidden';
        lastShade.style.removeProperty('visibility');
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

function addColor(e, insert = -1) {
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
    colorPicker.appendChild(rootDiv);
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
    if (insert == 0) colorPicker.insertBefore(rootDiv, e.target.parentElement);
    else if (insert == 1) colorPicker.insertBefore(rootDiv, e.target.parentElement.nextSibling);
    generateColor(rootDiv);
    adjustWidth();
    createShades(shadesDiv);
    currentColors.push('#'+colorCode.innerText);
}

function removeColor(e) {
    if (e.target.className == 'remove' && colorPicker.children.length > 1) {
        const parent = e.target.parentElement.parentElement.parentElement;
        removeCurrentColor('#'+parent.children[5].children[1].innerText);
        parent.remove();
        adjustWidth();
    }
}

function adjustWidth() {
    const n = colorPicker.children.length;
    const newWidth = 100 / n;
    for (var i = 0; i < n; i++) {
        colorPicker.children[i].style.width = newWidth + '%';
    }
}

function setCurrentColor(oldColor, newColor){
    for (let i = 0; i < currentColors.length; i++){
        if (currentColors[i] == oldColor) currentColors[i] = newColor;
    }
}

function removeCurrentColor(value){
    for  (let i = 0; i < currentColors.length; i++){
        if (currentColors[i] == value) currentColors.splice(i, 1);
    }
}

function getGrayScale(rgb) {
    return (0.333 * rgb[0] + 0.5 * rgb[1] + 0.16 * rgb[2]) / 255;
}

function RGBToHex(rgb) {
    rgb = rgb.map(c => Math.round(c));
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).substr(1);
}

function HexToRGB(hex) {
    return [(hex & 0xff0000) >> 16, (hex & 0x00ff00) >> 8, (hex & 0x0000ff)];
}