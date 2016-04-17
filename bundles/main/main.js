require('./main.styl');
require(['../../blocks/sign-in-form/sign-in-form'], function (signInFormModule) {
    let signInForm = document.querySelector('.sign-in-form');
    signInForm.classList.add('sign-in-form_hidden');
    let signInQuestion = document.querySelector('.sign-in__question');
    signInQuestion.classList.add('sign-in_hidden');

    var button = document.querySelector('.sign-in__hide-button');
    button.addEventListener('click', signInFormModule, false);
});
