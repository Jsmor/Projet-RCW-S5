// script/data_processor.js

// script/data_processor.js

// URIs des fichiers (Utilise la base absolue + le chemin relatif au dossier 'web')
const URL_DEMOGRAPHY = '../data/naissDecess.csv'; 
const URL_SOCIO_GEO = '../data/depPopulation.csv';
export const URL_GEOJSON = '../geoData/departements.geojson'; 
export const URL_REGION_GEOJSON = '../geoData/regions.geojson'; 

// Le panneau de débogage est accessible via l'ID dans le HTML
const debugPanel = document.getElementById('debug-panel');

/**
 * Charge un fichier CSV de manière robuste.
 */
export async function loadCSV(url) {
    if (debugPanel) debugPanel.innerHTML += `Tentative de chargement de ${url}...<br>`;
    const response = await fetch(url);
    if (!response.ok) {
        const status = response.status;
        throw new Error(`Échec du chargement de ${url}: Statut ${status}`);
    }
    const text = await response.text();
    
    const lines = text.trim().split('\n').filter(line => line.trim() !== '');

    if (lines.length < 1) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        const values = line.split(','); 
        
        const obj = {};
        headers.forEach((header, j) => {
            const val = values[j] ? values[j].trim() : '';
            
            let processedVal = val;
            if (val !== '') {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    processedVal = num;
                }
            }
            obj[header.trim()] = processedVal;
        });
        
        // Nettoyer l'URI du département (première colonne)
        const firstHeader = headers[0];
        if (obj[firstHeader] && typeof obj[firstHeader] === 'string') {
            obj[firstHeader] = obj[firstHeader].trim();
        }
        
        data.push(obj);
    }
    if (debugPanel) debugPanel.innerHTML += `Chargement de ${url} réussi (${data.length} lignes de données).<br>`;
    return data;
}

/**
 * Nettoie et uniformise les données socio-géographiques (gestion des doublons et des régions).
 */
function cleanSocioGeoData(data) {
    const cleanData = {};
    
    data.forEach(item => {
        const uri = item.departement; 
        
        if (uri && uri.startsWith('https://cours.iut-orsay.fr/jaj/')) {
            if (!cleanData[uri]) {
                cleanData[uri] = { 
                    departement: uri, 
                    departementLabel: null, 
                    population: 0, 
                    regions: new Set()
                };
            }
            
            if (item.departementLabel && !cleanData[uri].departementLabel) {
                cleanData[uri].departementLabel = item.departementLabel;
            }

            if (item.population && item.population > cleanData[uri].population) {
                cleanData[uri].population = item.population;
            }

            if (item.regionLabel && item.regionLabel !== item.departementLabel && item.regionLabel.indexOf('https') === -1) {
                cleanData[uri].regions.add(item.regionLabel);
            }
        }
    });

    // Sélectionner la meilleure région
    Object.values(cleanData).forEach(dep => {
        const regionArray = Array.from(dep.regions);
        const nonLocalRegion = regionArray.find(r => r !== dep.departementLabel && r !== 'Rhône' && r !== 'Seine' && r !== 'Département de Paris');
        
        dep.regionLabel = nonLocalRegion || regionArray[0] || 'Inconnu';
        delete dep.regions;
    });
    
    return Object.values(cleanData).filter(dep => dep.departementLabel && dep.population);
}


/**
 * Jointure, Calculs et Préparation des données finales.
 */
export function processData(demographyData, socioGeoData) {
    // Convertir les données socio-géo en Map pour une jointure rapide
    const socioGeoMap = new Map(socioGeoData.map(dep => [dep.departement, dep]));
    const finalData = [];
    let successfulJoins = 0;
    
    demographyData.forEach(demographyItem => {
        // La clé dans le fichier démographie est 'Departement' (avec D majuscule)
        const uri = demographyItem.Departement; 
        const socioGeoItem = socioGeoMap.get(uri);
        
        if (socioGeoItem && socioGeoItem.population && socioGeoItem.population > 0) {
            successfulJoins++;
            const naissances = demographyItem.Nombre_de_Naissances || 0;
            const deces = demographyItem.Nombre_de_Deces || 0;
            const population = socioGeoItem.population;

            const soldeNaturel = naissances - deces;
            const tauxNaturelPourMille = (soldeNaturel / population) * 1000;
            
            const codeINSEE = uri.split('/').pop();

            finalData.push({
                codeINSEE,
                departementLabel: socioGeoItem.departementLabel,
                regionLabel: socioGeoItem.regionLabel,
                population: population,
                naissances: naissances,
                deces: deces,
                soldeNaturel: soldeNaturel,
                tauxNaturelPourMille: tauxNaturelPourMille
            });
        }
    });
    if (debugPanel) debugPanel.innerHTML += `Jointure terminée. Nombre de départements avec données complètes: ${successfulJoins}.<br>`;
    return finalData;
}

/**
 * Agrège les données départementales au niveau régional.
 */
export function aggregateRegionalData(departmentData) {
    const regionalAgg = {};

    departmentData.forEach(d => {
        const region = d.regionLabel || 'Inconnu';
        
        if (!regionalAgg[region]) {
            regionalAgg[region] = { 
                regionLabel: region,
                naissances: 0, 
                deces: 0, 
                population: 0,
                departementsCount: 0
            };
        }
        
        regionalAgg[region].naissances += d.naissances;
        regionalAgg[region].deces += d.deces;
        regionalAgg[region].population += d.population;
        regionalAgg[region].departementsCount += 1;
    });

    return Object.values(regionalAgg).map(agg => {
        const soldeNaturel = agg.naissances - agg.deces;
        const tauxNaturelPourMille = (soldeNaturel / agg.population) * 1000;
        
        return {
            regionLabel: agg.regionLabel,
            naissances: agg.naissances,
            deces: agg.deces,
            soldeNaturel: soldeNaturel,
            population: agg.population,
            tauxNaturelPourMille: tauxNaturelPourMille
        };
    }).sort((a, b) => b.tauxNaturelPourMille - a.tauxNaturelPourMille);
}

/**
 * Fonction principale pour charger et traiter toutes les données.
 */
export async function loadAndProcessAllData() {
    try {
        const demographyData = await loadCSV(URL_DEMOGRAPHY);
        const socioGeoData = await loadCSV(URL_SOCIO_GEO);

        const socioGeoCleanedList = cleanSocioGeoData(socioGeoData);
        
        const finalData = processData(demographyData, socioGeoCleanedList);
        
        return finalData;

    } catch (error) {
        document.getElementById('debug-panel').innerHTML = `<p class="error-message">ERREUR CRITIQUE DANS DATA PROCESSING: ${error.message}.</p>`;
        console.error("Erreur critique lors du chargement ou du traitement des données.", error);
        return [];
    }
}