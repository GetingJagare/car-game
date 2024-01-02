import '../scss/main.scss';
import { loginForm } from './views/login-form';
import { getCookie, setCookie } from './helpers/cookie';

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML += loginForm();

    const loginInput = <HTMLInputElement>document.getElementById("userLogin"),
        prevLogin = getCookie("login");
    if (!prevLogin) {
        loginInput.value = prevLogin;
    }

    document.getElementById('subBut').addEventListener('click', () => {
        const userLogin = loginInput.value.trim(),
            loginForm = document.getElementById('loginForm');
        if (!userLogin) {
            const result = <HTMLDivElement>loginForm.querySelector('result');
            result.innerText = 'No Input';
        }
        else {
            setCookie(userLogin);
            loginForm.remove();
            //check();
        }
    });
});