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
                    <button onclick="validateAvis(${avis.id})">Validate</button>
                    <button onclick="invalidateAvis(${avis.id})">Invalidate</button>
                `;
                avisContainer.appendChild(avisElement);
            });
        });
}

function validateAvis(id) {
    fetch(`/employee/validate-avis/${id}`, { method: 'POST' })
        .then(() => loadAvis());
}

function invalidateAvis(id) {
    fetch(`/employee/invalidate-avis/${id}`, { method: 'POST' })
        .then(() => loadAvis());
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
