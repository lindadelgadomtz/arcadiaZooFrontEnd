const btnHabitats = document.getElementById("btnHabitats");
const habitatsInput = document.getElementById("habitatsInput");
const habitatsForm = document.getElementById("habitatsForm");
const descriptionInput = document.getElementById("descriptionInput");
const photoInput = document.getElementById("photoInput");

 // PhotoInput

btnHabitats.addEventListener("click", createHabitats);


async function createHabitats() {   
    event.preventDefault(); 
    var formData = new FormData(habitatsForm);

    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "nom": habitatsInput.value,
  "description": descriptionInput.value
});

    var requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow"
    };
    

await fetch("https://127.0.0.1:8000/api/habitat", requestOptions)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text();
})
.then(result => displayConfirmation(result))
.catch(error => displayError(error));
}


function displayConfirmation(response) {
alert("Merci. L'habitat a bien été ajouté!");
window.location.replace("/administrateur"); // Redirect to administrateur after successful submission
}

function displayError(error) {
alert("Une erreure est survenue. Merci d'essayer à nouveau.");
window.location.replace("/administrateur"); // Redirect to avis page if there's an error
}
