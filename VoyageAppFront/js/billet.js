async function afficherDetailsVoyage() {
    // Récupérer l'ID du voyage à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const voyageId = urlParams.get('voyageId');

    if (!voyageId) {
        console.error("L'ID du voyage n'est pas défini dans l'URL.");
        return;
    }

    console.log("Voyage ID récupéré:", voyageId);

    try {
        // Appeler l'API pour récupérer les détails du voyage
        const response = await fetch(`http://localhost:5074/api/voyages/${voyageId}`);
        const voyage = await response.json();

        if (response.ok) {
            document.getElementById('destination').textContent = voyage.destination;
            document.getElementById('prix').textContent = `${voyage.prix} €`;
            document.getElementById('dateDepart').textContent = reformaterDate(voyage.dateDepart);
            document.getElementById('dateRetour').textContent = reformaterDate(voyage.dateRetour);

            // Vérifie si l'utilisateur a déjà réservé ce voyage
            await verifierReservation(voyageId);
        } else {
            console.error('Erreur API:', voyage);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des informations du voyage :', error);
    }
}

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

async function verifierReservation(voyageId) {
    const utilisateurId = localStorage.getItem('utilisateurId');
    const boutonReservation = document.getElementById('boutonReservation');
    const messageConnexion = document.getElementById('messageConnexion');

    if (!utilisateurId) {
        // Si l'utilisateur n'est pas connecté
        boutonReservation.style.display = 'none';
        messageConnexion.style.display = 'block';
        return;
    }

    try {
        // Appel à l'API pour vérifier si l'utilisateur a déjà réservé ce voyage
        const response = await fetch(`http://localhost:5074/api/reservations?utilisateurId=${utilisateurId}&voyageId=${voyageId}`);
        const reservations = await response.json();

        if (reservations.length > 0) {
            // Si une réservation existe, cacher le bouton et afficher un message
            boutonReservation.style.display = 'none';
            messageConnexion.style.display = 'block';
            messageConnexion.textContent = "Vous avez déjà réservé ce voyage.";
        } else {
            // Sinon, afficher le bouton de réservation
            boutonReservation.style.display = 'block';
            messageConnexion.style.display = 'none';
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la réservation :", error);
        boutonReservation.style.display = 'none';
        messageConnexion.style.display = 'block';
        messageConnexion.textContent = "Erreur lors de la vérification de votre réservation.";
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

// Charger les détails du voyage dès que la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    afficherDetailsVoyage();
});


async function ajouterReservation() {
    const voyageId = new URLSearchParams(window.location.search).get('voyageId'); // Récupère l'ID du voyage
    const utilisateurId = localStorage.getItem('utilisateurId'); // Récupère l'ID de l'utilisateur depuis localStorage

    if (!utilisateurId) {
        alert("Vous devez être connecté pour réserver.");
        return;
    }

    if (!voyageId) {
        alert("Le voyage sélectionné est invalide.");
        return;
    }

    // Récupérer les détails du voyage pour les envoyer dans la réservation
    const voyageDetails = await fetch(`http://localhost:5074/api/voyages/${voyageId}`)
        .then(response => response.json())
        .catch(err => {
            console.error("Erreur lors de la récupération du voyage :", err);
            return null;
        });

    if (!voyageDetails) {
        alert("Impossible de récupérer les détails du voyage.");
        return;
    }

    // Créer l'objet de réservation
    const reservation = {
        UtilisateurId: utilisateurId,
        VoyageId: voyageId,
        Voyage: {
            VoyageId: voyageDetails.voyageId,
            Destination: voyageDetails.destination,
            DateDepart: voyageDetails.dateDepart,
            DateRetour: voyageDetails.dateRetour,
            Prix: voyageDetails.prix
        }
    };

    try {
        const response = await fetch('http://localhost:5074/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Réservation réussie !");
            window.location.href = "reservations.html"; // Redirection vers la page de mes réservations
        } else {
            const error = await response.json();
            alert(`Erreur lors de la réservation : ${error}`);
        }
    } catch (error) {
        console.error("Erreur lors de la réservation : ", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
}


// Lier le bouton de réservation à la fonction
document.getElementById('boutonReservation').addEventListener('click', ajouterReservation);

