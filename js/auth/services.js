const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('service');

console.log(serviceId);

if (serviceId) {
    fetch(`https://127.0.0.1:8000/api/service/${serviceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else if (data.message) {
                console.log(data.message);
            } else {
                console.log(data);
                injectServices(data);
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    // service.js
    fetch('https://127.0.0.1:8000/api/service')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(`Error: ${data.error}`);
            } else if (data.message) {
                console.log(data.message);
            } else {
                injectServices(data);
            }
        })
        .catch(error => console.error(`Error: ${error}`));
}



function injectServices(services) {
    const container = document.getElementById('services');
    console.log(services);

    services.forEach(service => {
        const serviceElement = document.createElement('div');
        serviceElement.classList.add('service');

        // Directly access the gallery path
        const gallerySrc = service.gallery ? service.gallery.replace('/img/', '/') : '';

        // Check if service.nom is defined
        const serviceNom = service.nom ? service.nom : 'No name provided';

        serviceElement.innerHTML = `
            <div class="col">
                    <div class="card">
                        <img src="https://127.0.0.1:8000/asset${gallerySrc}" class="card-img-top" alt="${serviceNom}">
                        <div class="card-body">
                            <h5 class="card-title">${serviceNom}</h5>
                            <p class="card-text">${service.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;

        container.appendChild(serviceElement);
    });
}

