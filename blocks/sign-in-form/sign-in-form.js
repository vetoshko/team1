define('signin-form', [], function () {
    return function () {
        var signInForm = document.querySelector('.sign-in-form');
        signInForm.classList.toggle('sign-in-form_hidden');

        var signInQuestion = document.querySelector('.sign-in__question');
        signInQuestion.classList.toggle('sign-in_hidden');
    };
});
