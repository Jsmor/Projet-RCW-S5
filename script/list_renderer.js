// script/list_renderer.js

/**
 * Génère le tableau HTML des données départementales.
 */
export function renderDepartmentList(departmentData, outputDivId) {
    const outputDiv = document.getElementById(outputDivId);
    if (!outputDiv || departmentData.length === 0) {
        if (outputDiv) outputDiv.innerHTML = `<p class="error-message">Aucune donnée départementale complète à afficher.</p>`;
        return;
    }

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
    outputDiv.innerHTML = tableHTML;
}


/**
 * Génère le tableau HTML des données régionales agrégées.
 */
export function renderRegionList(regionalData, outputDivId) {
    const outputDiv = document.getElementById(outputDivId);
    if (!outputDiv || regionalData.length === 0) {
        if (outputDiv) outputDiv.innerHTML = `<p class="error-message">Aucune donnée régionale complète à afficher.</p>`;
        return;
    }

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
    outputDiv.innerHTML = tableHTML;
}