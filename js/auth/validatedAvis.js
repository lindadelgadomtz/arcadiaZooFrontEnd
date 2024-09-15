const urlParams = new URLSearchParams(window.location.search);
const avisListValidatedPseudo = urlParams.get('avisListValidated');

if (avisListValidatedPseudo)
console.log(hola); {
    fetch('https://arcadiazoo-backend-03da514839c5.herokuapp.com/api/avis/validated')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Error: ${data.error}`);
        } else {
            injectAvis(data);
        }
    })
    .catch(error => console.error(`Error: ${error}`));
}

function injectAvis(avisListValidated) {
    const container = document.getElementById('avisListValidated');
    console.log(avisListValidated);

    avisListValidated.forEach(avis => {
        const avisElement = document.createElement('div');
        avisElement.classList.add('avisListValidated');

        avisElement.innerHTML = `
            <div class="col">
                <h5 class="card-title">${avis.pseudo}</h5>
                <p class="card-text">${avis.commentaire}</p>
            </div>
        `;

        container.appendChild(avisElement);
    });
}
