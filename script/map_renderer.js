// script/map_renderer.js

import { URL_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) par département.
 */
export function setupMap(data) {
    // ... (début de la fonction inchangé) ...
    
    // (Lignes existantes)
    const map = L.map('map').setView([46.6, 2.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // ... (le reste du code de calcul du taux, getColor, etc., est inchangé) ...

    fetch(URL_GEOJSON)
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
            // ... (gestion des erreurs inchangée) ...
        });
}