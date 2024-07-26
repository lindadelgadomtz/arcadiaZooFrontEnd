const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");

signoutBtn.addEventListener("click", signout);

function getRole(){
    return getCookie(roleCookieName);
}

function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    showAndHideElementsForRoles();
    window.location.reload();
}

function setToken(token) {
    console.log("Setting token:", token); // Log setting token
    setCookie(tokenCookieName, token, 7);
}

function getToken() {
    return getCookie(tokenCookieName);
}

function setCookie(name, value, days) {
    console.log("Setting cookie:", name, value); // Log setting cookie
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    console.log("Cookie set:", document.cookie); // Confirm cookie set and log all cookies
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected() {
    return getToken() !== null;
}

/*
disconnected
connected (admin ou vet ou employe)
    -admin
    -vet
    -employe

    */


    function showAndHideElementsForRoles() {
        const userConnected = isConnected();
        const role = getRole();
    
        let allElementsToEdit = document.querySelectorAll('[data-show]');
        console.log(allElementsToEdit)
    
        allElementsToEdit.forEach(element => {
            // Reset class for all elements to make sure they start in default state
            element.classList.remove("d-none");
            const roles = element.dataset.show.split(',');

    
            switch (element.dataset.show) {
                case 'disconnected':
                    if (userConnected) {
                        element.classList.add("d-none");
                    }
                    break;
                case 'connected':
                    if (!userConnected) {
                        element.classList.add("d-none");
                    }
                    break;
                case 'admin':
                    if (!userConnected || role !== "admin") {
                        element.classList.add("d-none");
                    }
                    break;
                case 'employe':
                    if (!userConnected || role !== "employe") {
                        element.classList.add("d-none");
                    }
                    break;
                case 'veterinaire':
                    if (!userConnected || role !== "veterinaire") {
                        element.classList.add("d-none");
                    }
                    break;
            }
        });
    }
    
    document.addEventListener("DOMContentLoaded", showAndHideElementsForRoles);

    