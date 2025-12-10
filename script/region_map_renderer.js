// script/region_map_renderer.js

import { URL_REGION_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) agrégé au niveau régional.
 */
export function setupRegionMap(regionalData) {
    // ... (début de la fonction inchangé) ...
    
    // (Lignes existantes)
    const map = L.map('map').setView([46.6, 2.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // ... (suite du code de couleur inchangé) ...

    fetch(URL_REGION_GEOJSON)
        // ... (suite du fetch et du L.geoJson) ...
        .then(geojson => {
            L.geoJson(geojson, {
                // ... (style et onEachFeature inchangés) ...
            }).addTo(map);

            // CORRECTION CRITIQUE : Invalider la taille après le chargement du GeoJSON
            setTimeout(function() {
                map.invalidateSize();
            }, 200); // Délai de 200ms pour garantir le rendu du DOM
        })
        .catch(error => {

        })
        .catch(error => {
            // ... (gestion des erreurs inchangées) ...
        });
}