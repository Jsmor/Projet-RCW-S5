// script/map_renderer.js

import { URL_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) par département.
 */
export function setupMap(data) {
    if (typeof L === 'undefined' || data.length === 0) return;

    const map = L.map('map').setView([46.6, 2.5], 6);

    // CORRECTION CRITIQUE 1: Invalider la taille IMMÉDIATEMENT après l'initialisation de la carte
    map.invalidateSize(); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const tauxMap = new Map(data.map(d => [d.codeINSEE, d]));
    const maxTaux = Math.max(...data.map(d => Math.abs(d.tauxNaturelPourMille)));

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

    fetch(URL_GEOJSON)
            .then(response => { /* ... */ })
            .then(geojson => {
                L.geoJson(geojson, { /* ... */ }).addTo(map);

                // CORRECTION CRITIQUE 2: Invalider la taille avec un délai long
                setTimeout(function() {
                    map.invalidateSize();
                }, 500);
        })
        .catch(error => {
            document.getElementById('debug-panel').innerHTML += `<p class="error-message">Erreur GeoJSON: ${error.message}.</p>`;
            console.error("Erreur Leaflet/GeoJSON:", error);
        });
}