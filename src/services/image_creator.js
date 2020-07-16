const { createCanvas } = require('canvas');
const fs = require('fs');

module.exports = (hex) => {
	const name = fs.readdirSync('./temp/').length + '.png';
	const width = 1920;
	const canvas = createCanvas(width, 1080);
	const context = canvas.getContext('2d');
	const widthColor= width / hex.length;
	let xPos = 0;
	hex.forEach((color) => {
		context.fillStyle = color;
		context.fillRect(xPos, 0, widthColor, 1080);
		xPos += widthColor;
	});

	fs.writeFileSync(`./temp/${name}`, canvas.toBuffer());
	return name;
}