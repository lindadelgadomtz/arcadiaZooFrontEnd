const btnSignin = document.getElementById("btnSignin");
const mailInput = document.getElementById("mailInput");
const passwordInput = document.getElementById("passwordInput");

btnSignin.addEventListener("click", checkCredentials);

async function checkCredentials() {
    // Check that the user exists and get the token
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": mailInput.value,
        "password": passwordInput.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://127.0.0.1:8000/api/login", requestOptions)
        .then(response => response.json())
        .then(result => login(result))
        .catch(error => console.log('error', error));
}

function login(response) {
    console.log('RESPO?SE', response)
    console.log('RESPO?SEjhefvzeyfvzyefv', response.roles)

    setToken(response.apiToken); // Ensure setToken is defined and working
    setCookie(roleCookieName, response.roles, 7); // Ensure setCookie is defined and working

    // Call showAndHideElementsForRoles before redirecting
    showAndHideElementsForRoles();

    // Verify before redirect
    if (response.roles.includes("ROLE_VETERINAIRE")) {
            console.log('veterinaire')
            window.location.replace("/veterinaire");
        }
    if (response.roles.includes("ROLE_EMPLOYEE")) {  
        console.log('emp')     
            window.location.replace("/administrateur");
    }
    if (response.roles.includes("ROLE_MANAGER")) { 
            console.log('admin')
            window.location.replace("/administrateur");
        } else {
            window.location.replace("/");
    }
}
