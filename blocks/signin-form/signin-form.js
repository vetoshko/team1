var button = document.querySelector('.singin-search__hide');
button.addEventListener('click', hide, false);

function hide() {
    var signin = document.querySelector('.signin');
    signin.classList.toggle('signin_hidden');
}
