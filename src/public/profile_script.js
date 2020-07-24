const container = document.querySelector('.pallete-container');

$(document).ready(() =>{
	$.ajax({
		type: 'GET',
		url: 'ajax/users-palletes',
		contentType: 'application/json',
		success: (response) =>{
			response.forEach((pallete) => {
				const palleteDiv = document.createElement('div');
				palleteDiv.classList.add('pallete');
				pallete.forEach((color) =>{
					const domString = `<div class="pallete-split" style='background-color: ${color[0]};'><a>${color[0].slice(1).toUpperCase()}</a></div>`;
					palleteDiv.innerHTML += domString;
				})
				palleteDiv.innerHTML += `<div class='downloads'><i>Saves 1</i><a id='info'><div class="content"><ul><li id="open-generator">Open in the generator</li><li>Copy URL</li><div class='shadow-splitter'></div><li>Save pallete</li><li>Export palette</li></ul></div></a></div>`;
				container.append(palleteDiv);
			});
		}
	})
})