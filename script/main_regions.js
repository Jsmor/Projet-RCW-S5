// script/main_regions.js (Utilisé pour l'analyse des régions)

import { loadAndProcessAllData, aggregateRegionalData } from '/Projet-RCW-S5/script/data_processor.js';
import { setupRegionChart } from '/Projet-RCW-S5/script/chart_renderer.js';
import { setupRegionMap } from '/Projet-RCW-S5/script/region_map_renderer.js';

const debugPanel = document.getElementById('debug-panel');

function displayRegionalStats(regionalData) {
    if (regionalData.length === 0) return;
    const totalPopulation = regionalData.reduce((acc, r) => acc + r.population, 0);
    const totalSolde = regionalData.reduce((acc, r) => acc + r.soldeNaturel, 0);
    const totalTaux = (totalSolde / totalPopulation) * 1000;

    document.getElementById('regional-stats-output').innerHTML = `
        <p><strong>Total Population (2021) :</strong> ${totalPopulation.toLocaleString('fr-FR')}</p>
        <p><strong>Solde Naturel National :</strong> ${totalSolde.toLocaleString('fr-FR')}</p>
        <p><strong>Taux National (‰) :</strong> ${totalTaux.toFixed(2)} ‰</p>
        <hr>
        <p>Région en tête (Taux) : <strong>${regionalData[0].regionLabel}</strong> (${regionalData[0].tauxNaturelPourMille.toFixed(2)} ‰)</p>
        <p>Région la moins dynamique : <strong>${regionalData[regionalData.length - 1].regionLabel}</strong> (${regionalData[regionalData.length - 1].tauxNaturelPourMille.toFixed(2)} ‰)</p>
    `;
}

async function initializeRegionalDashboard() {
    const departmentData = await loadAndProcessAllData();
    
    if (departmentData && departmentData.length > 0) {
        const regionalData = aggregateRegionalData(departmentData);
        
        if (debugPanel) debugPanel.innerHTML = `Données agrégées pour ${regionalData.length} régions.`;
        
        displayRegionalStats(regionalData);
        setupRegionChart(regionalData); 
        setupRegionMap(regionalData); 
        
    } else {
        if (debugPanel) debugPanel.innerHTML = `<p class="error-message">ERREUR: Aucune donnée départementale complète pour l'agrégation.</p>`;
    }
}

initializeRegionalDashboard();