document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch(apiUrl+'contact/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ title, name, description, email })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').textContent = data.message;
    })
    .catch(error => {
        document.getElementById('response').textContent = 'An error occurred: ' + error;
    });
});