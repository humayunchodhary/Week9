let mandiData = [
    { crop: 'Wheat (Gandum)', market: 'Multan', rate: 4680 },
    { crop: 'Maize (Makai)', market: 'Sahiwal', rate: 2950 },
    { crop: 'Rice (Kainat)', market: 'Lahore', rate: 35000 },
    { crop: 'Cotton (Kapaas)', market: 'Faisalabad', rate: 8100 }
];

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    populateTable();
});

function initChart() {
    const ctx = document.getElementById('mandiChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mandiData.map(d => d.crop),
            datasets: [{
                label: 'Market Price (Rs/40kg)',
                data: mandiData.map(d => d.rate),
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function populateTable() {
    const body = document.getElementById('mandiBody');
    body.innerHTML = mandiData.map(d => `<tr><td>${d.crop}</td><td>${d.market}</td><td>Rs. ${d.rate.toLocaleString()}</td></tr>`).join('');
}

function sendMessage() {
    const input = document.getElementById('userMsg');
    const display = document.getElementById('chatMessages');
    const typing = document.getElementById('typing');
    if(!input.value) return;

    display.innerHTML += `<div class="msg user">${input.value}</div>`;
    const text = input.value.toLowerCase();
    input.value = '';
    display.scrollTop = display.scrollHeight;

    typing.style.display = 'block';
    setTimeout(() => {
        typing.style.display = 'none';
        let botReply = "I am checking the agriculture database. Would you like to know about crop diseases or subsidies?";
        if(text.includes("wheat") || text.includes("price")) botReply = "Wheat prices in Punjab are currently averaging Rs. 4,680 per 40kg.";
        if(text.includes("tractor")) botReply = "The Punjab Green Tractor scheme is currently open. You can apply at the agriculture department website.";
        display.innerHTML += `<div class="msg bot">${botReply}</div>`;
        display.scrollTop = display.scrollHeight;
    }, 1200);
}

function getWeather() {
    const city = document.getElementById('city').value || "Punjab";
    document.getElementById('weatherDisplay').style.display = 'block';
    document.getElementById('weatherDisplay').innerHTML = `<strong>${city}:</strong> 39°C - Heavy Heatwave Warning.`;
    document.getElementById('adviceDisplay').style.display = 'block';
    document.getElementById('adviceDisplay').innerHTML = "Heat Alert: Do not harvest Wheat during high-speed winds. Irrigate vegetable crops at night.";
}

function addCrop() {
    const crop = document.getElementById('monitorCrop').value;
    const area = document.getElementById('cropArea').value;
    if(!area) return alert("Please enter the area.");
    document.getElementById('cropList').innerHTML += `<div class="info-card highlight"><strong>${crop}:</strong> ${area} Acres - Healthy growth detected via satellite.</div>`;
}

function detectDisease() {
    const res = document.getElementById('diseaseResult');
    res.style.display = 'block';
    res.innerHTML = "<strong>Scanning...</strong><br>Analysis complete: <strong>Mild Leaf Rust</strong> detected. Recommendation: Apply 200ml Propiconazole per acre.";
}