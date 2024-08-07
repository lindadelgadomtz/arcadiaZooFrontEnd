const urlParams = new URLSearchParams(window.location.search);
const habitatId = urlParams.get('habitat');

console.log(habitatId)

if(habitatId){
  fetch(`https://127.0.0.1:8000/api/habitat/${habitatId}`)
      .then(response => response.json())
      .then(data => {
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
  fetch('https://127.0.0.1:8000/api/habitat')
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
  const container = document.getElementById('habitats');
  habitats.forEach(habitat => {
      const habitatElement = document.createElement('div');
      habitatElement.classList.add('habitat');
      const gallerySrc = habitat.gallery[0] ? habitat.gallery[0].replace('/img/', '/') : '';
      habitatElement.innerHTML = `
      <div class="col">
      <a href="/habitats?habitat=${habitat.id}"
      <div class="card">
      <img src="https://127.0.0.1:8000/asset${gallerySrc}" class="card-img-top" alt="${habitat.nom}">
      <div class="card-body">
        <h5 class="card-title">${habitat.nom}</h5>
        <p class="card-text">${habitat.description}</p>
      </div>
    </div>
    </div>
      `;
      container.appendChild(habitatElement);
  });
}

function injectAnimals(habitat) {
  const container = document.getElementById('habitats');
  habitat.animals.forEach(animal => {
    console.log(animal)
      const habitatElement = document.createElement('div');
      habitatElement.classList.add('habitat');
      habitatElement.innerHTML = `
      <div class="col">
      <a href="/animals?animal=${animal.id}"
      <div class="card">
      <div class="card-body">
        <p class="card-text">animal</p>
      </div>
    </div>
    </div>
      `;
      container.appendChild(habitatElement);
  });
}
