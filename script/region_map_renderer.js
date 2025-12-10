// script/region_map_renderer.js

import { URL_REGION_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) agrégé au niveau régional.
 */
export function setupRegionMap(regionalData) {
    if (typeof L === 'undefined' || regionalData.length === 0) return;

    const map = L.map('map').setView([46.6, 2.5], 6);
    
    // CORRECTION CRITIQUE 1: Invalider la taille IMMÉDIATEMENT après l'initialisation de la carte
    map.invalidateSize(); 
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    const tauxMap = new Map(regionalData.map(d => [d.regionLabel, d]));
    const maxTaux = Math.max(...regionalData.map(d => Math.abs(d.tauxNaturelPourMille)));

    function getColor(taux) {
        if (taux > 0) {
            const intensity = Math.min(1, taux / maxTaux); 
            return `rgba(0, 128, 0, ${0.3 + 0.7 * intensity})`; 
        } else if (taux < 0) {
            const intensity = Math.min(1, Math.abs(taux) / maxTaux);
            return `rgba(255, 0, 0, ${0.3 + 0.7 * intensity})`; 
        } else {
            return '#ccc'; 
        }
    }

    fetch(URL_REGION_GEOJSON)
        // ... (fetch et geoJson initialisation) ...
        .then(geojson => {
            L.geoJson(geojson, { /* ... */ }).addTo(map);

            // CORRECTION CRITIQUE 2: Invalider la taille avec un délai long
            setTimeout(function() {
                map.invalidateSize();
            }, 500);
        })
        .catch(error => {
            document.getElementById('debug-panel').innerHTML += `<p class="error-message">Erreur GeoJSON Régions: ${error.message}.</p>`;
            console.error("Erreur Leaflet/GeoJSON Régions:", error);
        });
}