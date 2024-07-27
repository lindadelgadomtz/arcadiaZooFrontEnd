const btnRegistration = document.getElementById("btnRegistration");
const emailregistrationInput = document.getElementById("emailRegistrationInput");
const passwordRegistrationInput = document.getElementById("passwordRegistrationInput");
const roleInput1 = document.getElementById("roleInput1");
const roleInput2 = document.getElementById("roleInput2");

btnRegistration.addEventListener("click", createUser);

async function createUser(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    let selectedRole;
    if (roleInput1.checked) {
        selectedRole = "ROLE_VETERINAIRE";
    } else if (roleInput2.checked) {
        selectedRole = "ROLE_EMPLOYE";
    }


    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "email": emailregistrationInput.value,
  "password": passwordRegistrationInput.value,
  "roles": [selectedRole]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

await fetch("https://127.0.0.1:8000/api/registration", requestOptions)
  .then((response) => response.text())
  .then((result) => displayConfirmation(result))
  .catch((error) => displayError(error));

}

  function displayConfirmation(response) {
    alert('Utilisateur enregistré avec succès!');
    window.location.replace("/"); // Redirect to home after successful registration
}

function displayError(error) {
    alert("Une erreur est survenue. Merci d'essayer à nouveau.");
}