// Function to handle the registration form submission
async function handleRegister(event) {
    event.preventDefault(); // Prevent the form from reloading the page

    // Get form data (adjust IDs according to your HTML)
    const nomUtilisateur = document.getElementById('nomUtilisateur').value;
    const emailUtilisateur = document.getElementById('emailUtilisateur').value;
    const motDePasse = document.getElementById('motDePasse').value;

    // Prepare the data to send to the backend
    const utilisateurData = {
        nom: nomUtilisateur,
        email: emailUtilisateur,
        motDePasse: motDePasse
    };

    // Select the message element
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = ""; // Reset the message content
    messageDiv.style.color = ""; // Reset the message color

    try {
        // Make a POST request to the register endpoint
        const response = await fetch('http://localhost:5074/api/utilisateurs/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure content-type is set to JSON
            },
            body: JSON.stringify(utilisateurData),
        });

        // Check if the response is successful
        if (response.ok) {
            const { message } = await response.json(); // Extract the message from the JSON response
            messageDiv.textContent = message; // Display the success message
            messageDiv.style.color = "green"; // Set the text color to green
            // Optionally redirect after a delay
            setTimeout(() => {
                window.location.href = '/connexion.html'; // Adjust the URL as needed
            }, 2000);
        } else {
            const { error } = await response.json(); // Extract the error message from the JSON response
            messageDiv.textContent = `Erreur: ${error}`; // Display the error message
            messageDiv.style.color = "red"; // Set the text color to red
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = "Une erreur est survenue lors de l'inscription.";
        messageDiv.style.color = "red";
    }
}

// Attach event listener to the form submission (adjust ID according to your form)
document.getElementById('registerForm').addEventListener('submit', handleRegister);
