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

    await fetch(apiUrl+"login", requestOptions)
        .then(response => response.json())
        .then(result => login(result))
        .catch(error => console.log('error', error));
}

function login(response) {
    console.log('RESPONSE', response)
    console.log('USER ROLES', response.roles)

    setToken(response.apiToken); // Ensure setToken is defined and working
    setCookie(roleCookieName, response.roles, 7); // Ensure setCookie is defined and working
    setCookie(userIdCookieName, response.username, 7); // Ensure setCookie is defined and working

    // Call showAndHideElementsForRoles before redirecting
    showAndHideElementsForRoles();

   // Redirection logic based on roles
   if (response.roles.includes("ROLE_VETERINAIRE")) {
    console.log('Redirecting to veterinaire');
    window.location.replace("/veterinaire");
} else if (response.roles.includes("ROLE_EMPLOYEE")) {  
    console.log('Redirecting to employee');     
    window.location.replace("/employee");
} else if (response.roles.includes("ROLE_MANAGER")) { 
    console.log('Redirecting to administrateur');
    window.location.replace("/administrateur");
} else {
    console.log('Redirecting to home');
    window.location.replace("/");
}
}
