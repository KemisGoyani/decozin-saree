function getUser() {

    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;

}

function getToken() {

    return localStorage.getItem("token");

}

function isLoggedIn() {

    return getToken() !== null;

}

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}