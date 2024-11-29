const apiUrl = "http://localhost:5074/api/voyages";

// Fonction pour récupérer les voyages depuis l'API
async function fetchVoyages() {
    try {
        // Appel de l'API pour récupérer les voyages
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données depuis l'API.");
        }

        // Convertir les données en JSON
        const voyages = await response.json();
        displayVoyages(voyages);
    } catch (error) {
        console.error("Erreur:", error.message);
        // Affichage d'un message d'erreur dans le DOM
        const container = document.getElementById("voyages-container");
        container.innerHTML = `<p style="color: red;">Impossible de charger les voyages. Vérifiez votre connexion ou contactez un administrateur.</p>`;
    }
}

function displayVoyages(voyages) {
    const container = document.getElementById("voyages-container");
    container.innerHTML = "";

    const isUserConnected = localStorage.getItem("utilisateurId") !== null;

    voyages.forEach((voyage) => {
        const voyageElement = document.createElement("div");
        voyageElement.classList.add("voyage");
    
        const dateDepart = new Date(voyage.dateDepart).toLocaleDateString("fr-FR");
        const dateRetour = new Date(voyage.dateRetour).toLocaleDateString("fr-FR");
    
        voyageElement.innerHTML = `
            <h3>${voyage.destination}</h3>
            <p><strong>Date de départ :</strong> ${dateDepart}</p>
            <p><strong>Date de retour :</strong> ${dateRetour}</p>
            <p><strong>Prix :</strong> ${voyage.prix.toFixed(2)} €</p>
        `;
    
        const actionContainer = document.createElement("div");
    
        const reserveButton = document.createElement("button");
        reserveButton.textContent = "Réserver";
        reserveButton.setAttribute("data-voyage-id", voyage.VoyageId); // Stockage dans un attribut
        reserveButton.onclick = function() {
            const id = this.getAttribute("data-voyage-id"); // Récupération de l'ID
            console.log("Bouton cliqué avec l'ID :", id);
            reserverVoyage(id);
        };
        actionContainer.appendChild(reserveButton);
    
        voyageElement.appendChild(actionContainer);
        container.appendChild(voyageElement);
    });
    
}


function reserverVoyage(voyageId) {
    console.log("Voyage ID reçu :", voyageId); // Vérifie que l'ID est bien transmis ici
    const utilisateurId = localStorage.getItem("utilisateurId");

    if (!voyageId) {
        console.error("Erreur : voyageId est undefined");
        return;
    }

    if (!utilisateurId) {
        alert("Vous devez être connecté pour réserver un voyage.");
        return;
    }

    console.log(`Réservation du voyage avec l'ID ${voyageId} pour l'utilisateur ${utilisateurId}`);
}

// Charger les voyages au chargement de la page
document.addEventListener("DOMContentLoaded", fetchVoyages);


function toggleConnexionLink() {
    const userId = localStorage.getItem('utilisateurId');
    const loginLink = document.getElementById('login-link');

    if (userId) {
        loginLink.textContent = 'Déconnexion';
        loginLink.href = '#';
        loginLink.onclick = function() {
            localStorage.removeItem('utilisateurId');  // Supprimer l'ID utilisateur
            alert('Vous êtes déconnecté');
            toggleConnexionLink();  // Mettre à jour l'affichage
        };
    } else {
        loginLink.textContent = 'Connexion';
        loginLink.href = 'connexion.html';  // Redirige vers la page de connexion
    }
}

// Appeler cette fonction au chargement de la page pour afficher le bon lien
document.addEventListener('DOMContentLoaded', toggleConnexionLink);


// Fonction pour afficher ou masquer le bouton de réservation en fonction de la connexion
function afficherBoutonReservation() {
    const userId = localStorage.getItem('utilisateurId');
    const boutonReservation = document.getElementById('boutonReservation');
    const messageConnexion = document.getElementById('messageConnexion');

    if (userId) {
        // Si l'utilisateur est connecté, afficher le bouton de réservation
        boutonReservation.style.display = 'block';
        messageConnexion.style.display = 'none';
    } else {
        // Si l'utilisateur n'est pas connecté, afficher le message pour se connecter
        boutonReservation.style.display = 'none';
        messageConnexion.style.display = 'block';
    }
}

// Fonction pour reformater une date au format AAAA/MM/JJ
function reformaterDate(dateISO) {
    const date = new Date(dateISO);
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0'); // Mois entre 1-12
    const jour = String(date.getDate()).padStart(2, '0'); // Jour entre 1-31
    return `${jour}/${mois}/${annee}`;
}



