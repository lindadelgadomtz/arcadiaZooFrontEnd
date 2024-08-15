
/**************************************************************AVIS VALIDATION ********************************/


// employee_dashboard.js

loadAvis();
// validateAvis();
// invalidateAvis();
loadServices();


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
                    <button onclick="invalidateAvis(${avis.id})" class="btn btn-primary">Invalidate</button>
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




/******************************* SERVICES UPDATES ********************************/
const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('service');


async function loadServices() {
    try {
        const response = await fetch('https://127.0.0.1:8000/api/service');
        const services = await response.json();
        injectServices(services);
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function injectServices(services) {
    const container = document.getElementById('services');
    container.innerHTML = ''; // Clear the container before adding new services

    services.forEach(service => {
        const serviceElement = document.createElement('div');
        serviceElement.classList.add('service');

        const gallerySrc = service.gallery ? service.gallery.replace('/img/', '/') : '';
        const serviceNom = service.nom || 'No name provided';

        serviceElement.innerHTML = `
            <div class="col">
                <div class="card" style="width: 16rem;">
                    <img src="https://127.0.0.1:8000/asset${gallerySrc}" class="card-img-top" alt="${serviceNom}">
                    <div class="card-body">
                        <h5 class="card-title">${serviceNom}</h5>
                        <p class="card-text">${service.description}</p>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="addServiceId(${service.id})">Edit</button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(serviceElement);
    });
}

function addServiceId(id) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("service", id);
    // Met à jour l'URL sans recharger la page
    const newUrl = window.location.pathname + '?' + searchParams.toString();
    window.history.replaceState(null, '', newUrl);
}

const servicesInput = document.getElementById("servicesInput");
const servicesDescriptionInput = document.getElementById("servicesDescriptionInput");
const servicesPhotoInput = document.getElementById("servicesPhotoInput");

async function editService() {
    console.log('editttt')
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('service');
    console.log('Service ID:', id);

    if ((!servicesInput.value && !servicesDescriptionInput.value) && !servicesPhotoInput.files[0]){
        alert('Please fill in either the service name/description or upload a photo.');
        return;
        
    };

    try {
        if(servicesPhotoInput.files[0]){
            await editServicePhoto(id);
        }

        if(servicesInput.value || servicesDescriptionInput.value){
            editInputDescription(id);
        }
        
    } catch (error) {
        console.error('Error editing service details:', error);
    }

    async function editServicePhoto(event){
        const formdata = new FormData();
        formdata.append("title", servicesInput.value);
        formdata.append("image", servicesPhotoInput.files[0]);
    
        const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
        };
    
        await fetch(apiUrl+`gallery/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => editInputDescription(id, result.id))
        .catch((error) => console.error(error));
    }

    function editInputDescription(id) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            ...servicesInput.value && { "nom": servicesInput.value },
            ...servicesDescriptionInput.value && { "description": servicesDescriptionInput.value },
            "createdAt": "2024-07-18T14:30:00Z",
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`https://127.0.0.1:8000/api/service/${id}`, requestOptions)
            .then((response) => response.text(editInputDescription))
            .then((result) => window.location.reload())
            .catch((error) => console.error(error));
    }

}


async function deleteService() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('service');

    try {
        const response = await fetch(apiUrl+`service/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadServices();
        } else {
            alert('Failed to delete service.');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service.');
    }
}

(async () => {
        try {
            const response = await fetch('https://127.0.0.1:8000/api/service');
            const data = await response.json();

            if (data.error) {
                console.error(`Error: ${data.error}`);
            } else if (data.message) {
                console.log(data.message);
            } else {
                injectServices(data);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    })();

/*******************************************ANIMAL FEEDING MANAGEMENT********************************************************/

fetchAnimals();

document.getElementById("btnSubmitFoodLog").addEventListener("click", createFoodLog);

async function fetchAnimals() {
    try {
        const response = await fetch(apiUrl + "animal");
        const animals = await response.json();
        populateAnimalDropdown("animalSelectionInput", animals);
    } catch (error) {
        console.error("Error fetching animals:", error);
    }
}

function populateAnimalDropdown(dropdownId, items) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "";
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.prenom}, ${item.race.label}` || item.id;
        dropdown.appendChild(option);
    });
}

async function createFoodLog(event) {
    event.preventDefault();

    const animalSelectionInput = document.getElementById("animalSelectionInput").value;
    const datetimeInput = document.getElementById("datetimeInput").value;
    const nourritureInput = document.getElementById("nourritureInput").value;
    const grammageInput = document.getElementById("grammageInput").value;
    const userSelectionInput = getCookie(userIdCookieName);

    const payload = {
        "date": datetimeInput,
        "nourriture": nourritureInput,
        "nourriture_grammage_emp": parseInt(grammageInput),
        "animal": {
            "id": parseInt(animalSelectionInput),
        },
        "user": {
            "id": parseInt(userSelectionInput),
        }
    };

    try {
        const response = await fetch(apiUrl + "animalFeeding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            alert("Nourriture ajoutée avec succès!");
            window.location.reload("/employee");
        } else {
            const errorData = await response.json();
            console.error("Server responded with:", errorData);
            alert("Erreur lors de l'ajout de la nourriture.");
        }
    } catch (error) {
        console.error("Error creating food log:", error);
    }
}

