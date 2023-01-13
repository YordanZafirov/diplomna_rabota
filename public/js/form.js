// redirect to home page if logged in
window.onload = () => {
    if (localStorage.user) {
        user = JSON.parse(localStorage.user);
        if (compareToken(user.authToken, user.email)) {
            location.replace('/') 
        }
    }
}

const loader = document.querySelector('.loader');

const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const terms = document.querySelector('#terms-and-cond') || null;
const notification = document.querySelector('#notifications') || null;

// mail regex
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (name != null) { // if signup page
        if (name.value.length < 3) {
            showAlert('Name must be 3 characters long');
        } else if (!email.value.length) {
            showAlert('Enter your email');
        } else if (!mailformat.test(email.value)) {
            showAlert('Invalid email address')
        } else if (password.value.length < 6) {
            showAlert('Password must be 6 characters or more');
        } else if (!number.value.length) {
            showAlert('enter your phone number');
        } else if (!Number(number.value) || number.value.length != 10) {
            showAlert('Invalid phone number')
        } else if (!terms.checked) {
            showAlert('You must agree to our terms and conditions');
        } else {

            //submit form
            loader.style.display = 'block'
            sendData('/signup', {
                name: name.value,
                email: email.value,
                password: password.value,
                number: number.value,
                terms: terms.checked,
                notification: notification.checked,
                seller: false
            })
        }
    } else {
        //login form
        if (!email.value.length || !password.value.length) {
            showAlert('Fill all the inputs');
        } else {
            loader.style.display = 'block'
            sendData('/login', {
                email: email.value,
                password: password.value,
            })

        }
    }
});

