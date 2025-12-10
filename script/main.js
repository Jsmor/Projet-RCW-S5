// script/main.js

// Imports absolus depuis la racine du dépôt
import { loadAndProcessAllData, aggregateRegionalData } from '/Projet-RCW-S5/script/data_processor.js';
import { setupMap } from '/Projet-RCW-S5/script/map_renderer.js';
import { setupDepartmentChart, setupRegionChart } from '/Projet-RCW-S5/script/chart_renderer.js';

// Fonction d'initialisation (identique à celle qui était dans le HTML)
async function initializeDashboard() {
    const finalData = await loadAndProcessAllData();
    const debugPanel = document.getElementById('debug-panel');

    if (finalData && finalData.length > 0) {
        debugPanel.innerHTML = `Données chargées et prêtes pour ${finalData.length} départements.`;
        
        const regionalData = aggregateRegionalData(finalData);

        setupMap(finalData);
        setupDepartmentChart(finalData);
        setupRegionChart(regionalData);
        
    } else {
        debugPanel.innerHTML = `<p class="error-message">ERREUR: Aucune donnée finale pour l'affichage. Vérifiez la console et le panneau de débogage.</p>`;
    }
}

// Lancement de l'application
initializeDashboard();