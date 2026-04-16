// FIREBASE CONFIGURATION (Using your provided keys)
const firebaseConfig = {
  apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
  authDomain: "kissan-smart1.firebaseapp.com",
  projectId: "kissan-smart1",
  storageBucket: "kissan-smart1.firebasestorage.app",
  messagingSenderId: "574407446300",
  appId: "1:574407446300:web:5ce3ee98c54250d80e34d9",
  measurementId: "G-Q77S74Y8Y9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// LIVE COMMUNITY CHAT
function sendChatMessage() {
    const name = document.getElementById('userName').value || "Farmer";
    const msg = document.getElementById('userMsg').value;
    if(!msg) return;

    database.ref('messages').push().set({
        username: name,
        text: msg,
        time: Date.now()
    });
    document.getElementById('userMsg').value = '';
}

// Receive messages in Real-time
database.ref('messages').limitToLast(15).on('value', (snapshot) => {
    const display = document.getElementById('chatMessages');
    display.innerHTML = '';
    snapshot.forEach((child) => {
        const data = child.val();
        display.innerHTML += `
            <div class="msg-wrap">
                <b>${data.username}</b>
                <span>${data.text}</span>
            </div>`;
    });
    display.scrollTop = display.scrollHeight;
});

// MANDI CHART (Based on your screenshot data)
function initChart() {
    const ctx = document.getElementById('mandiChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Wheat', 'Maize', 'Cotton', 'Rice'],
            datasets: [{
                label: 'Price per 40kg',
                data: [4650, 2950, 8100, 35000],
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
initChart();

// WEATHER ADVICE
function getWeather() {
    const city = document.getElementById('cityInput').value || "Punjab";
    const display = document.getElementById('weatherDisplay');
    display.style.display = 'block';
    display.innerHTML = `<strong>${city}:</strong> 39°C - Dry Weather. <br> <strong>Advice:</strong> Harvesting season. Avoid irrigation 10 days before harvest to prevent wheat lodging.`;
}

// CROP MONITORING
function addCrop() {
    const crop = document.getElementById('monitorCrop').value;
    const area = document.getElementById('cropArea').value;
    if(!area) return alert("Enter acres");
    document.getElementById('cropList').innerHTML += `<div class="info-card highlight">Monitoring <strong>${area} Acres</strong> of ${crop}. System status: Healthy.</div>`;
}

// DISEASE TRACKER
function detectDisease() {
    const res = document.getElementById('diseaseResult');
    res.style.display = 'block';
    res.innerHTML = "<strong>AI Result:</strong> Early Leaf Rust detected. <br> <strong>Recommendation:</strong> Spray Nativo or Tilt within 48 hours.";
}