
/**************************************************************AVIS VALIDATION ********************************/


// employee_dashboard.js

loadAvis();
// validateAvis();
// invalidateAvis();
// loadServices();
// setupFeedingForm();

function loadAvis() {
    fetch('https://127.0.0.1:8000/api/avis')
        .then(response => response.json())
        .then(avis => {
            const avisContainer = document.getElementById('avis');
            avis.forEach(avis => {  
                const avisElement = document.createElement('div');
                avisElement.classList.add('review');
                avisElement.innerHTML = `
                    <p>${avis.pseudo}: ${avis.commentaire}</p>
                    <button onclick="validateAvis(${avis.id})" class="btn btn-primary">Validate</button>
                    <button onclick="invalidateAvis(${avis.id})" class="btn btn-secondary">Invalidate</button>
                `;
                avisContainer.appendChild(avisElement);
            });
        });
}

function validateAvis(id) {
    fetch(`https://127.0.0.1:8000/api/employee/validate-avis/${id}`, { method: 'POST' })
        .then(() => loadAvis())
        .then((result) => displayConfirmation(result))
        .catch((error) => displayError(error));
}

function invalidateAvis(id) {
    fetch(`https://127.0.0.1:8000/api/employee/invalidate-avis/${id}`, { method: 'POST' })
        .then(() => loadAvis())
        .then((result) => displayConfirmation(result))
        .catch((error) => displayError(error));
}

function loadServices() {
    fetch('/api/services')
        .then(response => response.json())
        .then(services => {
            const servicesContainer = document.getElementById('services');
            services.forEach(service => {
                const serviceElement = document.createElement('div');
                serviceElement.classList.add('service');
                serviceElement.innerHTML = `
                    <h3>${service.nom}</h3>
                    <p>${service.description}</p>
                    <button onclick="editService(${service.id})">Edit</button>
                `;
                servicesContainer.appendChild(serviceElement);
            });
        });
}

function editService(id) {
    // Logic to edit service
}

function setupFeedingForm() {
    const feedingForm = document.getElementById('feeding-form');
    feedingForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(feedingForm);
        fetch('/employee/feed-animal', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            // Handle success
        });
    });
}

function displayConfirmation(response) {
    alert('Enregistré avec succès!');
    window.location.replace("/employee");
  }
  
  function displayError(error) {
    alert("Une erreur est survenue. Merci d'essayer à nouveau.");
    window.location.replace("/employee");
  }
  



  /******************************* SERVICES REGISTRATION ********************************/
const btnServices = document.getElementById("btnServices");
const servicesInput = document.getElementById("servicesInput");
const servicesDescriptionInput = document.getElementById("servicesDescriptionInput");
const servicesPhotoInput = document.getElementById("servicesPhotoInput"); // ADD THE PICTURE INPUT

btnServices.addEventListener("click", uploadServicesPicture);

async function createServices(result) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "nom": servicesInput.value,
    "description": servicesDescriptionInput.value,
    "createdAt": "2024-07-18T14:30:00Z",
    "gallery": result.id
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  await fetch(apiUrl+"service", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse as JSON
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
  console.error(error); // Log the error for debugging
  window.location.replace("/administrateur"); // Redirect to avis page if there's an error
}

async function uploadServicesPicture(event) {
  event.preventDefault();

  const formdata = new FormData();
  formdata.append("title", servicesInput.value);
  formdata.append("image", servicesPhotoInput.files[0]);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };

  await fetch(apiUrl+"gallery", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse as JSON
    })
    .then((result) => createServices(result))
    .catch((error) => {
      console.error('Error:', error); // Log the error for debugging
      displayError(error);
    });
}


