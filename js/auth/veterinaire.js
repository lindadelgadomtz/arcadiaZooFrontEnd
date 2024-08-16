/*********************************************** RAPPORT VETERINAIRE **************************************/


fetchAnimalsRapport();

const btnRapport = document.getElementById("btnRapport");

btnRapport.addEventListener("click", createRapport);

async function fetchAnimalsRapport() {

  try {

    const response = await fetch(apiUrl+"animal");
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
    option.textContent = `${item.prenom}, ${item.race.label}` || item.id; // Adjust depending on your JSON structure
    dropdown.appendChild(option);
  });
}


async function createRapport(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const animalSelectionInput = document.getElementById("animalSelectionInput");
  const etatInput = document.getElementById("etatInput");
  const nourritureInput = document.getElementById("nourritureInput");
  const grammageInput = document.getElementById("grammageInput");
  const detailAnimalInput = document.getElementById("detailAnimalInput");
  const datetimeInput = document.getElementById("datetimeInput").value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "date": datetimeInput, // Ensure this date is dynamic if needed
    "detail": etatInput.value,
    "animal": {
      "id": animalSelectionInput.value,
    },
    "etat_animal": detailAnimalInput.value,
    "nourriture": nourritureInput.value,
    "nourriture_grammage": grammageInput.value
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(apiUrl + "rapportVeterinaire", requestOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const result = await response.json(); // Parse the JSON from the response

    displayConfirmation(result); // Call displayConfirmation on success

  } catch (error) {
    displayError(error);
  }
}


function displayConfirmation(response) {
  alert("Merci. L'rapport a bien été ajouté!");
  window.location.replace("/veterinaire"); // Redirect to veterinaire after successful submission
}

function displayError(error) {
  alert("Une erreure est survenue. Merci d'essayer à nouveau.");
  console.error(error); // Log the error for debugging
  window.location.replace("/veterinaire"); // Redirect to veterinaire if there's an error
}


/*********************************************** RAPPORT VETERINAIRE Compare**************************************/

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
      <table>
          <thead>
              <tr>
                  <th>État de l'animal</th>
                  <th>Nourriture</th>
                  <th>Grammage</th>
                  <th>Détail</th>
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
      <table>
          <thead>
              <tr>
                  <th>Nourriture</th>
                  <th>Grammage</th>
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