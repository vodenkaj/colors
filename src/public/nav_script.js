const signInBtn = document.getElementById('sign-in');
const signUpBtn = document.getElementById('sign-up');
const navModalContainer = document.querySelector('.nav-modal-container');
const signInModal = navModalContainer.children[0].children[1];
const signUpModal = navModalContainer.children[0].children[0];
let lastModal;

if (signInBtn) signInBtn.onmouseup = signIn;
if (signUpBtn) signUpBtn.onmouseup = signUp;

function signIn() {
	navModalContainer.style.visibility = 'visible';
	signInModal.style.display = 'flex';
	signInModal.style.visibility = 'visible';
	lastModal = signInModal;
}

function signUp() {
	navModalContainer.style.visibility = 'visible';
	signUpModal.style.display = 'flex';
	signUpModal.style.visibility = 'visible';
	lastModal = signUpModal;
}

navModalContainer.onmouseup = (e) => {
	switch(e.target.id){
		case 'close':
			navModalContainer.style.visibility = 'hidden';
			lastModal.style.display = 'none';
			lastModal.style.visibility = 'hidden';
			break;
		case 'register':
			lastModal.style.display = 'none';
			lastModal.style.visibility = 'hidden';
			signUp();
			break;
		case 'login':
			lastModal.style.display = 'none';
			lastModal.style.visibility = 'hidden';
			signIn();
			break;
	}
}