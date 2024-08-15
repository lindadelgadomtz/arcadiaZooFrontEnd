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


/*********************************************** RAPPORT VETERINAIRE VS RAPPORT EMPLOYEE **************************************/

document.getElementById('animalForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const animalId = document.getElementById('animalId').value;
  const date = document.getElementById('date').value;

  if (!animalId || !date) {
      alert('Please enter both a valid animal ID and date.');
      return;
  }

  // Fetch the comparison data from the backend
  fetch(`/compareFoodLog/${animalId}/${date}`)
      .then(response => response.json())
      .then(data => {
          displayResults(data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          alert('An error occurred while fetching data. Please try again.');
      });
});

function displayResults(data) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = ''; // Clear previous results

  if (data.error) {
      resultsContainer.innerHTML = `<p>${data.error}</p>`;
      return;
  }

  // Display employee food logs
  const employeeLogsHtml = createTableHtml(data.employeeFoodLogs, 'Employee Food Logs');
  resultsContainer.innerHTML += employeeLogsHtml;

  // Display veterinarian reports
  const vetReportsHtml = createTableHtml(data.veterinaireRapports, 'Veterinarian Reports');
  resultsContainer.innerHTML += vetReportsHtml;

  // You can implement additional comparison logic here
  // For example, highlight discrepancies between logs and reports
  compareLogs(data.employeeFoodLogs, data.veterinaireRapports);
}

function createTableHtml(dataArray, title) {
  if (!dataArray || dataArray.length === 0) {
      return `<div class="result"><h3>${title}</h3><p>No data available.</p></div>`;
  }

  let tableHtml = `<div class="result"><h3>${title}</h3><table><thead><tr>`;
  const headers = Object.keys(dataArray[0]);
  headers.forEach(header => {
      tableHtml += `<th>${header}</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;

  dataArray.forEach(item => {
      tableHtml += `<tr>`;
      headers.forEach(header => {
          tableHtml += `<td>${item[header]}</td>`;
      });
      tableHtml += `</tr>`;
  });

  tableHtml += `</tbody></table></div>`;
  return tableHtml;
}

function compareLogs(employeeLogs, vetReports) {
  // Basic comparison logic example (more complex logic can be implemented as needed)
  employeeLogs.forEach(empLog => {
      const correspondingVetReport = vetReports.find(vetReport => vetReport.date === empLog.date);

      if (correspondingVetReport) {
          if (empLog.nourriture !== correspondingVetReport.nourriture) {
              console.warn(`Discrepancy found on ${empLog.date}: Food differs. Employee: ${empLog.nourriture}, Vet: ${correspondingVetReport.nourriture}`);
          }
          if (empLog.nourriture_grammage_emp !== correspondingVetReport.nourriture_grammage) {
              console.warn(`Discrepancy found on ${empLog.date}: Grammage differs. Employee: ${empLog.nourriture_grammage_emp}, Vet: ${correspondingVetReport.nourriture_grammage}`);
          }
      }
  });
}
