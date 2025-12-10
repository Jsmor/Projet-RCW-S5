// script/list_renderer.js

/**
 * Génère le tableau HTML des données départementales.
 * @param {Array} departmentData - Les données départementales complètes.
 * @param {string} outputDivId - L'ID de l'élément div où insérer le tableau.
 */
export function renderDepartmentList(departmentData, outputDivId) {
    if (departmentData.length === 0) {
        document.getElementById(outputDivId).innerHTML = `<p class="error-message">Aucune donnée départementale complète à afficher.</p>`;
        return;
    }

    // Tri par taux naturel pour avoir le plus dynamique en premier
    departmentData.sort((a, b) => b.tauxNaturelPourMille - a.tauxNaturelPourMille);

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Département</th>
                    <th>Région</th>
                    <th>Population</th>
                    <th>Solde Naturel</th>
                    <th>Taux Naturel (‰)</th>
                </tr>
            </thead>
            <tbody>
    `;
    departmentData.forEach(d => {
        const soldeClass = d.soldeNaturel < 0 ? 'negative-solde' : 'positive-solde';
        tableHTML += `
            <tr>
                <td>${d.codeINSEE}</td>
                <td>${d.departementLabel}</td>
                <td>${d.regionLabel}</td>
                <td>${d.population.toLocaleString('fr-FR')}</td>
                <td class="${soldeClass}">${d.soldeNaturel.toLocaleString('fr-FR')}</td>
                <td class="${soldeClass}">${d.tauxNaturelPourMille.toFixed(2)}</td>
            </tr>
        `;
    });
    tableHTML += `</tbody></table>`;
    document.getElementById(outputDivId).innerHTML = tableHTML;
}


/**
 * Génère le tableau HTML des données régionales agrégées.
 * @param {Array} regionalData - Les données régionales agrégées.
 * @param {string} outputDivId - L'ID de l'élément div où insérer le tableau.
 */
export function renderRegionList(regionalData, outputDivId) {
    if (regionalData.length === 0) {
        document.getElementById(outputDivId).innerHTML = `<p class="error-message">Aucune donnée régionale complète à afficher.</p>`;
        return;
    }

    // Tri par taux naturel pour avoir le plus dynamique en premier
    regionalData.sort((a, b) => b.tauxNaturelPourMille - a.tauxNaturelPourMille);

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Région</th>
                    <th>Population</th>
                    <th>Naissances</th>
                    <th>Décès</th>
                    <th>Solde Naturel</th>
                    <th>Taux Naturel (‰)</th>
                </tr>
            </thead>
            <tbody>
    `;
    regionalData.forEach(r => {
        const soldeClass = r.soldeNaturel < 0 ? 'negative-solde' : 'positive-solde';
        tableHTML += `
            <tr>
                <td>${r.regionLabel}</td>
                <td>${r.population.toLocaleString('fr-FR')}</td>
                <td>${r.naissances.toLocaleString('fr-FR')}</td>
                <td>${r.deces.toLocaleString('fr-FR')}</td>
                <td class="${soldeClass}">${r.soldeNaturel.toLocaleString('fr-FR')}</td>
                <td class="${soldeClass}">${r.tauxNaturelPourMille.toFixed(2)}</td>
            </tr>
        `;
    });
    tableHTML += `</tbody></table>`;
    document.getElementById(outputDivId).innerHTML = tableHTML;
}