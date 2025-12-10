// script/map_renderer.js

import { URL_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) par département.
 */
export function setupMap(data) {
    if (typeof L === 'undefined' || data.length === 0) return;

    // --- CORRECTION CLÉ : Initialisation de la carte ---
    const map = L.map('map', {
        // Option essentielle : ne pas initialiser le centre tant que la taille n'est pas connue
        maxBoundsViscosity: 1.0 
    }).setView([46.6, 2.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // ... (le code pour tauxMap et getColor reste le même) ...

    fetch(URL_GEOJSON)
        // ... (le code fetch/then reste le même) ...
        .then(geojson => {
            L.geoJson(geojson, {
                // ... (style et onEachFeature restent les mêmes) ...
            }).addTo(map);
            
            // --- CORRECTION CLÉ : Forcer le redimensionnement après le rendu ---
            setTimeout(() => {
                map.invalidateSize();
            }, 50); // Petit délai de 50ms pour laisser le DOM se stabiliser
        })
        .catch(error => {
            // ... (gestion des erreurs) ...
        });
}