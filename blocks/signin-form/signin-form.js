var button = document.querySelector('.singin-search__hide');
button.addEventListener('click', hideAndShow, false);

function hideAndShow() {
    var signin = document.querySelector('.signin');
    signin.classList.toggle('signin_hidden');
}
