// script/chart_renderer.js

/**
 * Affiche le graphique de classement Top/Flop 10 des départements.
 */
export function setupDepartmentChart(data) {
    if (data.length === 0) return;
    
    if (typeof Chart === 'undefined') return;

    data.sort((a, b) => b.tauxNaturelPourMille - a.tauxNaturelPourMille);
    const top10 = data.slice(0, 10);
    const bottom10 = data.slice(-10).reverse(); 
    const chartData = [...top10, ...bottom10];

    const ctx = document.getElementById('tauxDepartementChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => `${d.departementLabel} (${d.codeINSEE})`),
            datasets: [{
                label: 'Taux Naturel (‰)',
                // CORRECTION ICI : Remplacer tauxNaturalPourMille par tauxNaturelPourMille
                data: chartData.map(d => d.tauxNaturelPourMille), 
                backgroundColor: chartData.map(d => d.tauxNaturelPourMille > 0 ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)')
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Taux Naturel (‰)' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * Affiche le graphique du Taux Naturel par Région.
 */
export function setupRegionChart(regionalData) {
    if (regionalData.length === 0) return;
    
    if (typeof Chart === 'undefined') return;

    regionalData.sort((a, b) => b.tauxNaturelPourMille - a.tauxNaturelPourMille);

    const ctx = document.getElementById('tauxRegionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regionalData.map(d => d.regionLabel),
            datasets: [{
                label: 'Taux Naturel (‰)',
                data: regionalData.map(d => d.tauxNaturelPourMille),
                backgroundColor: regionalData.map(d => d.tauxNaturelPourMille > 0 ? '#28a745' : '#dc3545')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { title: { display: true, text: 'Taux Naturel (‰)' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}