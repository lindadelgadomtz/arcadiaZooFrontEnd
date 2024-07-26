const btnSubmit = document.getElementById("btnSubmit");
const pseudoInput = document.getElementById("pseudoInput");
const commentInput = document.getElementById("commentInput");
const ratingInput = document.getElementById("ratingInput");

btnSubmit.addEventListener("click", submitComment);

async function submitComment(event) {
    event.preventDefault();  // Prevent the default form submission behavior

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

    await fetch("https://127.0.0.1:8000/api/avis", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(result => displayConfirmation(result))
    .catch(error => displayError(error));
}


/*function displayConfirmation(response) {
    console.log('RESPO?SEjhefvzeyfvzyefv', response)
    alert('Merci. Votre commentaire a été pris en compte!')
}*/

function displayError(error) {
    console.log(error)
    alert("Une erreure est survenue. Merci d'essayer à nouveau.")
}
