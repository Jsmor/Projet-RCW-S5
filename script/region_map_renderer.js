// script/region_map_renderer.js

import { URL_REGION_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) agrégé au niveau régional.
 */
export function setupRegionMap(regionalData) {
    if (typeof L === 'undefined' || regionalData.length === 0) return;

    // --- CORRECTION CLÉ : Initialisation de la carte ---
    const map = L.map('map', {
        maxBoundsViscosity: 1.0 
    }).setView([46.6, 2.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // ... (le code pour tauxMap et getColor reste le même) ...

    fetch(URL_REGION_GEOJSON)
        // ... (le code fetch/then reste le même) ...
        .then(geojson => {
            L.geoJson(geojson, {
                // ... (style et onEachFeature restent les mêmes) ...
            }).addTo(map);

            // --- CORRECTION CLÉ : Forcer le redimensionnement après le rendu ---
            setTimeout(() => {
                map.invalidateSize();
            }, 50); // Petit délai de 50ms
        })
        .catch(error => {
            // ... (gestion des erreurs) ...
        });
}