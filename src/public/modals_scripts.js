const modalContainer = document.querySelector('.modal-container');
let lastModul;

modalContainer.addEventListener('mouseup', (e) => {
    exportColors(e);
    copyToClipboard(e);
})

function openModal(e) {
    switch (e.target.id){
        case 'export':
            modalContainer.style.visibility = 'visible';
            modalContainer.children[0].children[0].style.display = 'initial';
            modalContainer.children[0].children[0].style.visibility = 'visible';
            palleteContainer.style.pointerEvents = 'none';
            break;
        case 'save':
            isUserLoggedIn();
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
            
            palleteContainer.style.pointerEvents = 'all';
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
            palleteContainer.style.pointerEvents = 'all';
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
    currentColors.map(x => x[0]).forEach((color) => name.push(convertStringToUTF8ByteArray(color)));
    
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

        const rgb = HexToRGB(parseInt(currentColors[i][0].slice(1), 16));

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
    currentColors.map(x => x[0]).forEach((color) => {
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
    palleteContainer.childNodes.forEach((x) => {
        if (x.className == 'downloads') return;
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

function isUserLoggedIn(){
    const user = document.getElementById('user');
    if (user){
        modalContainer.style.visibility = 'visible';
        modalContainer.children[0].children[3].style.display = 'initial';
        modalContainer.children[0].children[3].style.visibility = 'visible';
        palleteContainer.style.pointerEvents = 'none';
        document.getElementById('color-data').value = JSON.stringify(currentColors);
    }
    else {
        signIn();
    }
}