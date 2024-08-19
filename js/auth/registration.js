/*********************************************** USER REGISTRATION **************************************/

const btnRegistration = document.getElementById("btnRegistration");
const emailregistrationInput = document.getElementById("emailRegistrationInput");
const passwordRegistrationInput = document.getElementById("passwordRegistrationInput");
const roleInput1 = document.getElementById("roleInput1");
const roleInput2 = document.getElementById("roleInput2");

btnRegistration.addEventListener("click", createUser);

async function createUser(event) {
  event.preventDefault();  // Prevent the default form submission behavior

  let selectedRole;
  if (roleInput1.checked) {
    selectedRole = "ROLE_VETERINAIRE";
  } else if (roleInput2.checked) {
    selectedRole = "ROLE_EMPLOYE";
  }


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "email": emailregistrationInput.value,
    "password": passwordRegistrationInput.value,
    "roles": [selectedRole]
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  await fetch(apiUrl+"registration", requestOptions)
    .then((response) => response.text())
    .then((result) => displayConfirmation(result))
    .catch((error) => displayError(error));

}

function displayConfirmation(response) {
  alert('Utilisateur enregistré avec succès!');
  window.location.replace("/"); // Redirect to home after successful registration
}

function displayError(error) {
  alert("Une erreur est survenue. Merci d'essayer à nouveau.");
}




/*********************************************** HABITATS REGISTRATION **************************************/

const btnHabitats = document.getElementById("btnHabitats");
const habitatsInput = document.getElementById("habitatsInput");
const descriptionInput = document.getElementById("descriptionInput");
const photoInput = document.getElementById("photoInput"); // ADD THE PICTURE INPUT

btnHabitats.addEventListener("click", createHabitats);

async function createHabitats(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "nom": habitatsInput.value,
    "description": descriptionInput.value
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  await fetch(apiUrl+"habitat", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse as JSON
    })
    .then(result => uploadPicture(result))
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

async function uploadPicture(result) {
  console.log('habitat', result);

  const formdata = new FormData();
  formdata.append("title", habitatsInput.value);
  formdata.append("image", photoInput.files[0]);
  formdata.append("habitat", result.id);

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
    .then((result) => displayConfirmation(result))
    .catch((error) => {
      console.error('Error:', error); // Log the error for debugging
      displayError(error);
    });
}




/**************************************************************ANIMAL REGISTRATION ********************************/


fetchRaces();
fetchHabitats();

const btnAnimal = document.getElementById("btnAnimal");

btnAnimal.addEventListener("click", createAnimal);


async function fetchRaces() {

  try {
    const response = await fetch(apiUrl+"race");
    const races = await response.json();
    populateDropdown("raceSelectionInput", races);
  } catch (error) {
    console.error("Error fetching races:", error);
  }
}

async function fetchHabitats() {
  try {
    const response = await fetch(apiUrl+"habitat");
    const habitats = await response.json();
    populateDropdown("habitatSelectionInput", habitats);
  } catch (error) {
    console.error("Error fetching habitats:", error);
  }
}

function populateDropdown(dropdownId, items) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label || item.nom; // Adjust depending on your JSON structure
    dropdown.appendChild(option);
  });
}

async function createAnimal(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const animalInput = document.getElementById("animalInput");
  const raceSelectionInput = document.getElementById("raceSelectionInput");
  console.log("race", raceSelectionInput)
  const habitatSelectionInput = document.getElementById("habitatSelectionInput");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "prenom": animalInput.value,
    "etat": "A determiner par le vétérinaire",
    "race": {
      "id": raceSelectionInput.value
    },
    "habitat": {
      "id": habitatSelectionInput.value
    }
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    await fetch(apiUrl+"animal", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse as JSON
      })
      .then(result => uploadAnimalPicture(result))
      .catch(error => displayError(error));
  } catch (error) {
    console.error("Error fetching races:", error);
  }
}

function displayConfirmation(response) {
  alert("Merci. L'animal a bien été ajouté!");
  window.location.replace("/administrateur"); // Redirect to administrateur after successful submission
}

function displayError(error) {
  alert("Une erreure est survenue. Merci d'essayer à nouveau.");
  console.error(error); // Log the error for debugging
  window.location.replace("/administrateur"); // Redirect to avis page if there's an error
}

async function uploadAnimalPicture(result) {
  const animalPhotoInput = document.getElementById("animalPhotoInput"); // ADD THE PICTURE INPUT

  const formdataAnimal = new FormData();
  formdataAnimal.append("title", result.prenom);
  formdataAnimal.append("image", animalPhotoInput.files[0]);
  formdataAnimal.append("animal", result.id);
  formdataAnimal.append("habitat", result.habitat.id);

  console.log('formdata', `${result.prenom} - ${result.race}`);
  console.log('formdata', animalPhotoInput.files[0]);
  console.log('formdata', result.habitat.id);
  console.log('formdata', formdataAnimal);

  const requestOptions = {
    method: "POST",
    body: formdataAnimal,
    redirect: "follow"
  };

  await fetch(apiUrl+"gallery", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse as JSON
    })
    .then((result) => displayConfirmation(result))
    .catch((error) => {
      console.error('Error:', error); // Log the error for debugging
      displayError(error);
    });
  
  }



/****************************** RACES REGISTRATION   ********************************/
const btnNouvelleRace = document.getElementById("btnNouvelleRace");
const nouvelleRaceInput = document.getElementById("nouvelleRaceInput");

btnNouvelleRace.addEventListener("click", createRace);

async function createRace(event){
  event.preventDefault();  // Prevent the default form submission behavior

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    "label": nouvelleRaceInput.value
  });
  
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  await fetch(apiUrl+"race", requestOptions)
    .then((response) => response.text())
    .then((result) => displayConfirmation(result))
    .catch((error) => displayError(error));

}

function displayConfirmation(response) {
  alert('Race enregistré avec succès!');
  console.log(response);
  window.location.replace("/administrateur"); // Redirect to home after successful registration
}

function displayError(error) {
  alert("Une erreur est survenue. Merci d'essayer à nouveau.");
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
  alert("Merci. Le service a bien été ajouté!");
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


/*********************************************** RAPPORT VETERINAIRE COMPARE**************************************/

fetchAnimals();

document.getElementById('animalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const animalSelectionInput = document.getElementById('animalCompareSelectionInput').value;
    const date = document.getElementById('date').value;

    if (!animalSelectionInput || !date) {
        alert('Please select an animal and a date.');
        return;
    }

    // Fetch the comparison data using the selected animal ID
    fetch(apiUrl + `compareFoodLog/${animalSelectionInput}/${date}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        });
});

async function fetchAnimals() {
    try {
        const response = await fetch(apiUrl + "animal");
        const animals = await response.json();
        populateAnimalDropdown("animalCompareSelectionInput", animals);
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
        option.textContent = `${item.prenom}, ${item.race.label}` || item.id; // Adjust according to your JSON structure
        dropdown.appendChild(option);
    });
}

function displayResults(data) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = ""; // Clear previous results

  if (!data || data.error) {
      resultsContainer.innerHTML = `<p>${data.error || 'No data found'}</p>`;
      return;
  }

  console.log(data);
  // Create a section for veterinary reports
  const vetReportsSection = document.createElement('div');
  vetReportsSection.classList.add('result');
  vetReportsSection.innerHTML = `
      <h3>Rapport Vétérinaire for ${data.animal}</h3>
      <table class="table mb-4">
          <thead>
              <tr>
                  <th scope="col">État de l'animal</th>
                  <th scope="col">Nourriture</th>
                  <th scope="col">Grammage</th>
                  <th scope="col">Détail</th>
              </tr>
          </thead>
          <tbody>
              ${data.veterinaryReports.map(report => `
                  <tr>
                      <td>${report.etat_animal}</td>
                      <td>${report.nourriture}</td>
                      <td>${report.nourriture_grammage}g</td>
                      <td>${report.detail}</td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
  `;
  resultsContainer.appendChild(vetReportsSection);

  // Create a section for animal feedings
  const feedingsSection = document.createElement('div');
  feedingsSection.classList.add('result');
  feedingsSection.innerHTML = `
      <h3>Feeding Log for ${data.animal}</h3>
      <table class="table mb-4">
          <thead>
              <tr>
                  <th scope>Nourriture</th>
                  <th scope>Grammage</th>
              </tr>
          </thead>
          <tbody>
              ${data.animalFeedings.map(feeding => `
                  <tr>
                      <td>${feeding.nourriture}</td>
                      <td>${feeding.nourriture_grammage_emp}g</td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
  `;
  resultsContainer.appendChild(feedingsSection);
}


