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

function findParentElement(node, parentId){
	while (node.tagName != 'body'){
		node = node.parentElement;
		if (node.id == parentId || node.classList.contains(parentId)) 
			return node
	}
	return null;
}

function findChildren(node, childrenId){
	if (!node) return null;
	if (node.id == childrenId || node.classList.contains(childrenId))
		return node
	node = node.children;
	let i = 0;
	for (let i = 0; i < node.length; i++){
		if (node[i].id == childrenId || node[i].classList.contains(childrenId)){
			return node[i]
		}
		const next = findChildren(node[i], childrenId);
		if (next) return next;
	}
	 return null;
}