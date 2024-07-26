const btnSignin = document.getElementById("btnSignin");
const mailInput = document.getElementById("mailInput");
const passwordInput = document.getElementById("passwordInput");

// Verify elements are correctly selected
console.log(btnSignin, mailInput, passwordInput); 

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    // Verify the event listener is firing
    console.log("Button clicked");

    // Check email and password values
    console.log("Email:", mailInput.value);
    console.log("Password:", passwordInput.value);

    if (mailInput.value === "test@mail.com" && passwordInput.value === "123") {
        alert("Vous êtes connecté");

        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        // Verify token is set
        console.log("Token:", token); 
        setToken(token); // Ensure setToken is defined and working
        setCookie(roleCookieName, "admin", 7); // Ensure setCookie is defined and working

         // Call showAndHideElementsForRoles before redirecting
         showAndHideElementsForRoles();

        // Verify before redirect
        console.log("Redirecting to home page");
        window.location.replace("/");
    } else {
        console.log("Invalid credentials"); // Indicate invalid credentials
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}
