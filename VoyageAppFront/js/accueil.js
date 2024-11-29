// Fonction pour récupérer les voyages depuis l'API
async function rechercherVoyages() {
    const searchQuery = document.getElementById('rechercheVoyage').value;

    // Envoi de la requête de recherche au back-end
    const response = await fetch(`http://localhost:5074/api/voyages/recherche?query=${searchQuery}`);
    const voyages = await response.json();

    afficherVoyages(voyages);
}

// Fonction pour afficher les voyages dans le DOM
function afficherVoyages(voyages) {
    const voyagesListe = document.getElementById('voyagesListe');
    voyagesListe.innerHTML = '';  // Vider la liste avant d'afficher de nouveaux éléments

    voyages.forEach(voyage => {
        const listItem = document.createElement('li');
        
        // Formatage des dates (si nécessaire)
        const dateDepart = new Date(voyage.dateDepart).toLocaleDateString("fr-FR");
        const dateRetour = new Date(voyage.dateRetour).toLocaleDateString("fr-FR");

        listItem.innerHTML = `
            <a href="billet.html?voyageId=${voyage.voyageId}">
                <h3>${voyage.destination}</h3>
                <p><strong>Date de départ :</strong> ${dateDepart}</p>
                <p><strong>Date de retour :</strong> ${dateRetour}</p>
                <p><strong>Prix :</strong> ${voyage.prix.toFixed(2)} €</p>
            </a>
        `;

        voyagesListe.appendChild(listItem);
    });
}

// Fonction pour afficher ou cacher le bouton de connexion/déconnexion en fonction de l'état de l'utilisateur
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

// Event listener pour rechercher les voyages à chaque frappe de l'utilisateur
document.getElementById('rechercheVoyage').addEventListener('input', rechercherVoyages);
