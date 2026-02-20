const express = require('express');
const cors = require('cors'); // Le pont pour accepter Netlify
const app = express();

app.use(cors()); // Autorise la communication
app.use(express.json());

// Simulation de la base de données
let utilisateurs = [
    { id: 'johan', nom: 'Johan DL', disciples_inscrits: 0, disciples: [] }
];

app.post('/api/inscription', (req, res) => {
    const { nom_nouvel_inscrit, id_parrain } = req.body;
    const parrain = utilisateurs.find(u => u.id === id_parrain);

    if (!parrain) return res.status(404).json({ erreur: "Lien de parrainage invalide." });
    
    if (parrain.disciples_inscrits >= 2) {
        return res.status(403).json({ erreur: "La mission de ce parrain est déjà accomplie." });
    }

    const nouveau_disciple = { 
        id: nom_nouvel_inscrit.toLowerCase(), 
        nom: nom_nouvel_inscrit, 
        disciples_inscrits: 0, 
        disciples: [] 
    };
    
    utilisateurs.push(nouveau_disciple);
    parrain.disciples.push(nouveau_disciple.id);
    parrain.disciples_inscrits += 1;

    res.status(201).json({ message: "Inscription réussie !", parrain_status: parrain.disciples_inscrits });
});

// Render décide du port automatiquement
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Le moteur Yeshua Ministries tourne sur le port ${PORT}`));
