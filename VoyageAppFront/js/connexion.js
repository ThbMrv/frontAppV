async function handleLogin(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const utilisateur = document.getElementById('utilisateur').value;
    const motdepasse = document.getElementById('motdepasse').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = '';
    messageDiv.style.color = '';

    if (!utilisateur || !motdepasse) {
        messageDiv.textContent = "Veuillez remplir tous les champs.";
        messageDiv.style.color = "red";
        return;
    }

    const loginData = {
        nom: utilisateur,
        motDePasse: motdepasse,
    };

    try {
        const response = await fetch('http://localhost:5074/api/utilisateurs/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const { utilisateurId, message } = await response.json(); // Récupérer la réponse JSON
            messageDiv.textContent = message || "Connexion réussie !";
            messageDiv.style.color = "green";

            // Stocker l'ID utilisateur
            localStorage.setItem('utilisateurId', utilisateurId);
            console.log('ID utilisateur enregistré dans localStorage :', utilisateurId);

            setTimeout(() => {
                window.location.href = '/voyages.html';
            }, 2000);
        } else {
            const error = await response.text();
            messageDiv.textContent = `Erreur : ${error}`;
            messageDiv.style.color = "red";
        }
    } catch (error) {
        console.error('Erreur de connexion :', error);
        messageDiv.textContent = "Une erreur est survenue lors de la connexion.";
        messageDiv.style.color = "red";
    }
}

// Ajouter l'écouteur d'événement pour la soumission du formulaire
document.getElementById('loginForm').addEventListener('submit', handleLogin);
