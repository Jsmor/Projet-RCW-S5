// script/main.js (Utilisé pour l'analyse des départements)

import { loadAndProcessAllData, aggregateRegionalData } from '/Projet-RCW-S5/script/data_processor.js';
import { setupMap } from '/Projet-RCW-S5/script/map_renderer.js';
import { setupDepartmentChart, setupRegionChart } from '/Projet-RCW-S5/script/chart_renderer.js';

// Fonction d'initialisation
async function initializeDashboard() {
    const finalData = await loadAndProcessAllData();
    const debugPanel = document.getElementById('debug-panel');

    if (finalData && finalData.length > 0) {
        if (debugPanel) debugPanel.innerHTML = `Données chargées et prêtes pour ${finalData.length} départements.`;
        
        const regionalData = aggregateRegionalData(finalData);

        // Rendu des visualisations
        setupMap(finalData); // Carte départementale
        setupDepartmentChart(finalData); // Top/Flop Départements
        setupRegionChart(regionalData); // Graphique Régions (Comparaison)
        
    } else {
        if (debugPanel) debugPanel.innerHTML = `<p class="error-message">ERREUR: Aucune donnée finale pour l'affichage.</p>`;
    }
}

initializeDashboard();