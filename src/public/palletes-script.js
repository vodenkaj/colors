let isWorking = false;
let outOfRecords = false;
let page = 0; 

$(document).ready(() =>{
	post();
});

$(window).scroll(()=>{
	if ($(this).scrollTop() + 1 >= $(document).height() - $('body').height()){
		if (isWorking == false){
			isWorking = true;
			post()
			setTimeout(() => isWorking = false, 1000);
		}
	}
})

function post(){
	if (!outOfRecords){
		$.ajax({
		type: 'POST',
		url: '/ajax/pallete-list',
		contentType: 'application/json',
		data: JSON.stringify({page: page++}),
		success: (response) =>{
			if (response.length == 0) {
				outOfRecords = true;
				return
			}
			const data = $('.pallete-container');
			response.forEach((pallete) => {
				let palleteDiv = document.createElement('div');
				palleteDiv.classList.add('pallete');
				pallete.forEach((color) =>{
					let domString = `<div class="pallete-split" style='background-color: ${color[0]};'><a>${color[0].slice(1).toUpperCase()}</a></div>`;
					palleteDiv.innerHTML += domString;
				})
				palleteDiv.innerHTML += `<div class='downloads'><i>Saves 1</i><a id='info'><div class="content"><ul><li id="open-generator">Open in the generator</li><li>Copy URL</li><div class='shadow-splitter'></div><li>Save pallete</li><li>Export palette</li></ul></div></a></div>`;
				data.append(palleteDiv);
				});
			}
		});
	}
}