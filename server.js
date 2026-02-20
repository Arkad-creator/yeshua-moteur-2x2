const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// La base de données en mémoire
let utilisateurs = [
    { id: 'johan', nom: 'johan', pays: '🌍 Global', disciples_inscrits: 0, disciples: [] }
];

// NOUVEAU : Le moteur renvoie l'état exact pour allumer les lumières
app.get('/api/utilisateur/:id', (req, res) => {
    const user = utilisateurs.find(u => u.id === req.params.id.toLowerCase());
    if (user) {
        // On récupère aussi les infos des disciples pour les afficher
        const detailsDisciples = user.disciples.map(id => utilisateurs.find(u => u.id === id));
        res.json({ ...user, details_disciples: detailsDisciples });
    } else {
        res.status(404).json({ erreur: "Utilisateur non trouvé" });
    }
});

// NOUVEAU : La liste de secours (Backup)
app.get('/api/secours', (req, res) => {
    res.json(utilisateurs);
});

// Mise à jour de l'inscription (avec Pays et RGPD)
app.post('/api/inscription', (req, res) => {
    const { nom_nouvel_inscrit, id_parrain, pays } = req.body;
    const parrain = utilisateurs.find(u => u.id === id_parrain.toLowerCase());

    if (!parrain) return res.status(404).json({ erreur: "Lien de parrainage invalide." });
    if (parrain.disciples_inscrits >= 2) return res.status(403).json({ erreur: "La mission de ce parrain est déjà accomplie." });

    const nouveau_disciple = { 
        id: nom_nouvel_inscrit.toLowerCase(), 
        nom: nom_nouvel_inscrit, 
        pays: pays || 'Non renseigné',
        disciples_inscrits: 0, 
        disciples: [] 
    };
    
    utilisateurs.push(nouveau_disciple);
    parrain.disciples.push(nouveau_disciple.id);
    parrain.disciples_inscrits += 1;

    res.status(201).json({ message: "Inscription réussie !" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Moteur Yeshua sur le port ${PORT}`));
