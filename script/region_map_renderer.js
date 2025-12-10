// script/region_map_renderer.js

import { URL_REGION_GEOJSON } from './data_processor.js'; 

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰) agrégé au niveau régional.
 */
export function setupRegionMap(regionalData) {
    if (typeof L === 'undefined' || regionalData.length === 0) return;

    const map = L.map('map').setView([46.6, 2.5], 6);

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
        .then(response => {
            if (!response.ok) throw new Error(`GeoJSON Régions Statut ${response.status}`);
            return response.json();
        })
        .then(geojson => {
            L.geoJson(geojson, {
                style: function(feature) {
                    // ATTENTION: Assurez-vous que la propriété 'nom' du GeoJSON correspond au regionLabel
                    const regionName = feature.properties.nom; 
                    const regionData = tauxMap.get(regionName);
                    const taux = regionData ? regionData.tauxNaturelPourMille : 0;
                    return {
                        fillColor: getColor(taux),
                        weight: 1.5,
                        opacity: 1,
                        color: 'black',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    const regionName = feature.properties.nom;
                    const regionData = tauxMap.get(regionName);

                    if (regionData) {
                        layer.bindPopup(`
                            <b>Région: ${regionData.regionLabel}</b><br>
                            Solde Naturel: ${regionData.soldeNaturel.toLocaleString('fr-FR')}<br>
                            Taux Naturel: <b>${regionData.tauxNaturelPourMille.toFixed(2)} ‰</b>
                        `);
                    } else {
                        layer.bindPopup(`<b>Région: ${regionName}</b><br>Données non disponibles`);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            document.getElementById('debug-panel').innerHTML += `<p class="error-message">Erreur GeoJSON Régions: ${error.message}.</p>`;
            console.error("Erreur Leaflet/GeoJSON Régions:", error);
        });
}