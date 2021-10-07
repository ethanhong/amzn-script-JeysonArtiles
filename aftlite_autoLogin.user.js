// ==UserScript==
// @name         AUTO LOGIN - AFT LITE
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.1
// @description  LOGIN AUTOMATICALLY
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/*
// @grant        none
// ==/UserScript==

const autoLog = () => {
    const signIn = document.querySelector("input[name=commit]");
    if (window.location.href.indexOf("/login") != -1) signIn.click();
}

const inputUsername = document.querySelector('#name');
inputUsername.value = "username";  // <====== replace with your username

const inputPassword = document.querySelector('#password');
inputPassword.value = "password"; // <====== replace with your password


autoLog();

/*

let username, password;

if (!localStorage.username && !localStorage.username) {
    username = prompt("Enter scanner username", "");
    password = prompt("Enter scanner password", "");

    localStorage.username = username;
    localStorage.password = password;

    const inputUsername = document.querySelector('#name');
    inputUsername.value = username;

    const inputPassword = document.querySelector('#password');
    inputPassword.value = password;

    autoLog();

}


*/
