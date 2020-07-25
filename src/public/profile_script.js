const container = document.querySelector('.pallete-container');

$(document).ready(() =>{
	$.ajax({
		type: 'GET',
		url: 'ajax/user-palletes',
		contentType: 'application/json',
		success: (response) =>{
			response.forEach((pallete) => {
				const palleteDiv = document.createElement('div');
				palleteDiv.classList.add('pallete');
				pallete.forEach((color) =>{
					let domString = `<div class="pallete-split" style='background-color: ${color[0]};'><a style='color: ${color[1]};'>${color[0].slice(1).toUpperCase()}</a></div>`;
					palleteDiv.innerHTML += domString;
				})
				palleteDiv.innerHTML += 
				`<div class='downloads'>
					<i>Saves 1</i>
					<aa id='info'>
						<div class="content">
							<ul>
								<li id="open-generator">
									<a href="/${(pallete.map((x) => {return x[0]})).join('-').replace(/#/g, '')}">Open in the generator</a>
								</li>
								<li id="copy-url">Copy URL</li>
								<div class='shadow-splitter'></div>
								<li id="save">Save pallete</li>
								<li id="export">Export palette</li>
							</ul>
						</div>
					</aa>
				</div>`;
				container.append(palleteDiv);
			});
		}
	})
})

container.onmouseup = (e) => {
	if (e.target.tagName != 'LI') return;
	currentColors = e.target.parentElement.children[0].children[0].getAttribute('href').slice(1).replace(/-/g, '').match(/.{1,6}/g);
	currentColors = currentColors.map((color) => '#' + color);
	palleteContainer = findParentElement(e.target, 'pallete');
	openModal(e);
	switch(e.target.id){
		case 'copy-url':
			const text = document.createElement('textarea');
			text.value = `${document.location.hostname}:${document.location.port}${e.target.previousElementSibling.children[0].getAttribute('href')}`;
			document.body.appendChild(text);
			text.select();
			document.execCommand('copy');
			text.remove()
			break;
	}
}