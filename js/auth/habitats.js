const urlParams = new URLSearchParams(window.location.search);
const habitatId = urlParams.get('habitat');

console.log(habitatId)

if(habitatId){
  fetch(apiUrl + `animal/habitat/${habitatId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched animal data:', data); 
          if (data.error) {
              console.error('Error:', data.error);
          } else if (data.message) {
              console.log(data.message);
          } else {
            console.log(data)
            injectAnimals(data);
          }
      })
      .catch(error => console.error('Error:', error));
} else {
  // habitats.js
  fetch('https://arcadiazoo-backend-03da514839c5.herokuapp.com/api/habitat')
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          console.log('Error:', data.error);
      } else if (data.message) {
          console.log(data.message);
      } else {
        console.log(data)
          injectHabitats(data);
      }
  })
  .catch(error => console.error('Error:', error));
}


function injectHabitats(habitats) {
  console.log(habitats)
  const container = document.getElementById('habitats');
  habitats.forEach(habitat => {
      const habitatElement = document.createElement('div');
      habitatElement.classList.add('habitat');
      const gallerySrc = habitat.gallery[0] ? habitat.gallery[0].replace('/img/', '/') : '';
      habitatElement.innerHTML = `
      <div class="col">
      <a href="/habitats?habitat=${habitat.id}"
      <div class="card">
      <img src="https://arcadiazoo-backend-03da514839c5.herokuapp.com/asset${gallerySrc}" class="card-img-top" alt="${habitat.nom}">
      <div class="card-body">
        <h5 class="card-title">${habitat.nom}</h5>
        <p class="card-text">${habitat.description}</p>
      </div>
    </div>
    </a>
    </div>
      `;
      container.appendChild(habitatElement);
  });
}

function injectAnimals(animals) {
  const container = document.getElementById('habitats');
  console.log(animals)
  animals.forEach(animal => {
    const habitatElement = document.createElement('div');
    habitatElement.classList.add('habitat');

    // Assume the first gallery entry contains the correct `url_image` path
    const galleryUrl = animal.gallery[0] 
        ? animal.gallery[0]  // Use the `url_image` directly
        : ''; // Default to an empty string if no image exists

    habitatElement.innerHTML = `
      <div class="col">
        <div class="card">
          <img src="https://127.0.0.1:8000${galleryUrl}" class="card-img-top" alt="${animal.prenom}">
          <div class="card-body">
            <h5 class="card-title">${animal.prenom}</h5>
            <p class="card-text">${animal.race.label}</p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(habitatElement);
  });
}



