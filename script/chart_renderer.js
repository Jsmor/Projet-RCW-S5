// script/map_renderer.js
import { URL_GEOJSON } from './data_processor.js';

/**
 * Affiche la carte choroplèthe du Taux Naturel (‰).
 * @param {Array} data - Les données départementales complètes.
 */
export function setupMap(data) {
    if (typeof L === 'undefined') {
        document.getElementById('map').innerHTML = `<p class="error-message">Leaflet non chargé. Vérifiez le lien JS Leaflet.</p>`;
        return;
    }
    if (data.length === 0) {
         document.getElementById('map').innerHTML = `<p class="error-message">Aucune donnée démographique complète à afficher sur la carte.</p>`;
         return;
    }
    
    const map = L.map('map').setView([46.6, 2.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const tauxMap = new Map(data.map(d => [d.codeINSEE, d]));
    const maxTaux = Math.max(...data.map(d => Math.abs(d.tauxNaturelPourMille)));

    // Fonction pour déterminer la couleur basée sur le Taux Naturel
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

    // Charger le GeoJSON et dessiner la carte
    fetch(URL_GEOJSON)
        .then(response => {
            if (!response.ok) throw new Error(`GeoJSON Statut ${response.status}`);
            return response.json();
        })
        .then(geojson => {
            L.geoJson(geojson, {
                style: function(feature) {
                    const code = feature.properties.code; 
                    const depData = tauxMap.get(code);
                    const taux = depData ? depData.tauxNaturelPourMille : 0;
                    return {
                        fillColor: getColor(taux),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    const code = feature.properties.code;
                    const depData = tauxMap.get(code);

                    if (depData) {
                        layer.bindPopup(`
                            <b>${depData.departementLabel || 'Inconnu'} (${code})</b><br>
                            Région: ${depData.regionLabel}<br>
                            Taux Naturel: <b>${depData.tauxNaturelPourMille.toFixed(2)} ‰</b>
                        `);
                    } else {
                        layer.bindPopup(`<b>${feature.properties.nom} (${code})</b><br>Données non disponibles`);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            document.getElementById('debug-panel').innerHTML += `<p class="error-message">Erreur GeoJSON: ${error.message}.</p>`;
            console.error("Erreur Leaflet/GeoJSON:", error);
        });
}