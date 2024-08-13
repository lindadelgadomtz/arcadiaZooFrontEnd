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
  console.log("create Rapport", createRapport);

  const animalSelectionInput = document.getElementById("animalSelectionInput");
  const etatInput = document.getElementById("etatInput");
  const nourritureInput = document.getElementById("nourritureInput");
  const grammageInput = document.getElementById("grammageInput");
  const detailAnimalInput = document.getElementById("detailAnimalInput");
  const raceSelectionInput = document.getElementById("raceSelectionInput");
  const habitatSelectionInput = document.getElementById("habitatSelectionInput");

  console.log("Inputs collected:");
  console.log("Animal Selection:", animalSelectionInput.value);
  console.log("Etat:", etatInput.value);
  console.log("Nourriture:", nourritureInput.value);
  console.log("Grammage:", grammageInput.value);
  console.log("Detail Animal:", detailAnimalInput.value);
  console.log("Race Selection:", raceSelectionInput.value);
  console.log("Habitat Selection:", habitatSelectionInput.value);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "date": "2024-07-18",
    "detail": etatInput.value,
    "animal": {
      "id": animalSelectionInput.value,
      "race": {
        "id": raceSelectionInput.value,
      },
      "habitat": {
        "id": habitatSelectionInput.value,
      }
    },
    "etat_animal": detailAnimalInput.value,
    "nourriture": nourritureInput.value,
    "nourriture_grammage": grammageInput.value

  });

  console.log("Request payload:", raw);


  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };


  try {
    await fetch(apiUrl+"rapportVeterinaire", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse as JSON
      })
      .catch(error => displayError(error));
  } catch (error) {
    console.error("Error fetching races:", error);
  }
}

function displayConfirmation(response) {
  alert("Merci. L'rapport a bien été ajouté!");
  window.location.replace("/administrateur"); // Redirect to administrateur after successful submission
}

function displayError(error) {
  alert("Une erreure est survenue. Merci d'essayer à nouveau.");
  console.error(error); // Log the error for debugging
  window.location.replace("/administrateur"); // Redirect to administrateur if there's an error
}
