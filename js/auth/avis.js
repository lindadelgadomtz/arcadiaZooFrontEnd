const btnAvis = document.getElementById("btnAvis");
const pseudoInput = document.getElementById("pseudoInput");
const commentInput = document.getElementById("commentInput");

btnAvis.addEventListener("click", submitComment);

async function submitComment(event) {
    event.preventDefault();  // Prevent the default form submission behavior
console.log("hola");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "pseudo": pseudoInput.value,
        "commentaire": commentInput.value,
        "isVisible": false
    });

    console.log(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    await fetch(apiUrl+"avis", requestOptions)
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
    alert('Merci. Votre commentaire a été pris en compte!');
    window.location.replace("/"); // Redirect to home after successful submission
}

function displayError(error) {
    alert("Une erreure est survenue. Merci d'essayer à nouveau.");
    window.location.replace("/avis"); // Redirect to avis page if there's an error
}