/*********************************************** RAPPORT VETERINAIRE **************************************/


fetchAnimals();

const btnRapport = document.getElementById("btnRapport");

btnRapport.addEventListener("click", createRapport);

async function fetchAnimals() {

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

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "date": "2024-07-18", // Ensure this date is dynamic if needed
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
  window.location.replace("/veterinaire"); // Redirect to administrateur after successful submission
}

function displayError(error) {
  alert("Une erreure est survenue. Merci d'essayer à nouveau.");
  console.error(error); // Log the error for debugging
  window.location.replace("/veterinaire"); // Redirect to administrateur if there's an error
}
