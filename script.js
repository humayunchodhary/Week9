// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4", // Ensure this is active
    authDomain: "kissan-smart1.firebaseapp.com",
    projectId: "kissan-smart1",
    databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com",
    appId: "1:574407446300:web:5ce3ee98c54250d80e34d9"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 2. LANGUAGE TOGGLE ---
let lang = "en";
function toggleLanguage() {
    lang = lang === "en" ? "ur" : "en";
    const btn = document.getElementById("lang-btn");
    
    if (lang === "ur") {
        btn.innerText = "🌐 EN";
        document.getElementById("hero-title").innerText = "پاکستان کے کسانوں کو بااختیار بنانا";
        document.getElementById("hero-moto").innerText = '"خوشحال کسان، مضبوط پاکستان"';
        document.body.style.direction = "rtl";
    } else {
        btn.innerText = "🌐 UR";
        document.getElementById("hero-title").innerText = "Empowering the Farmers of Pakistan";
        document.getElementById("hero-moto").innerText = '"Khushhal Kissan, Mazboot Pakistan"';
        document.body.style.direction = "ltr";
    }
}

// --- 3. BROWSER NOTIFICATIONS ---
function enableNotifications() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification("Kissan Smart", { body: "Notifications are already enabled!" });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Welcome!", { body: "You will now receive Mandi and Weather updates." });
            }
        });
    }
}

// --- 4. LIVE WEATHER (OpenWeather API) ---
async function getWeather() {
    const city = document.getElementById("cityInput").value || "Multan";
    const apiKey = "416cd6ed6380471e42e8bfeb624c1708"; 
    const display = document.getElementById("weather-display");
    
    display.innerText = "Fetching data...";
    
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},PK&appid=${apiKey}&units=metric`);
        if(!res.ok) throw new Error("City not found");
        const data = await res.json();
        display.innerHTML = `📍 <b>${data.name}</b>: ${data.main.temp}°C | Humidity: ${data.main.humidity}% | ${data.weather[0].description.toUpperCase()}`;
    } catch (error) {
        display.innerText = "❌ Could not fetch weather. Please check the city name.";
    }
}
// Load default weather on start
getWeather();

// --- 5. CROP MANAGEMENT (Local Array for Demo, can be linked to Firebase) ---
let crops = [];
function addCrop() {
    const name = document.getElementById("cropName").value;
    const date = document.getElementById("sowingDate").value;
    
    if (name && date) {
        crops.push({ name, date });
        renderCrops();
        document.getElementById("cropName").value = "";
        document.getElementById("sowingDate").value = "";
    } else {
        alert("Please enter both Crop Name and Sowing Date");
    }
}
function renderCrops() {
    const list = document.getElementById("cropList");
    list.innerHTML = crops.map(c => `<div style="background:#e8f5e9; padding:10px; margin-top:10px; border-radius:5px; border-left:4px solid #2e7d32;"><b>${c.name}</b> - Sown on: ${c.date}</div>`).join('');
}

// --- 6 & 7. MANDI TABLE & CHART ---
// Table Data via Firebase
db.ref("mandiRates").on("value", snap => {
    let html = "";
    // Fallback static data if Firebase is empty during testing
    if(!snap.exists()) {
        html = `
            <tr><td>Lahore</td><td>Wheat</td><td>Rs. 4,200</td></tr>
            <tr><td>Multan</td><td>Cotton</td><td>Rs. 8,500</td></tr>
            <tr><td>Faisalabad</td><td>Sugarcane</td><td>Rs. 450</td></tr>
        `;
    } else {
        snap.forEach(c => {
            const v = c.val();
            html += `<tr><td>${v.city || 'Punjab'}</td><td>${v.name}</td><td>Rs. ${v.price}</td></tr>`;
        });
    }
    document.getElementById("mandi-body").innerHTML = html;
});

// Chart.js Setup
const ctx = document.getElementById('mandiChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Wheat', 'Cotton', 'Rice', 'Sugarcane', 'Maize'],
        datasets: [{
            label: 'Average Price (PKR per 40kg)',
            data: [4200, 8500, 5000, 450, 3200],
            backgroundColor: '#2e7d32',
            borderRadius: 5
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// --- 8. LIVE CHAT SYSTEM ---
function sendMessage() {
    const msg = document.getElementById("chatInput").value;
    if(msg.trim() !== "") {
        db.ref("chat").push({ text: msg, timestamp: Date.now() });
        document.getElementById("chatInput").value = "";
    }
}

db.ref("chat").on("value", snap => {
    let html = "";
    snap.forEach(m => {
        const v = m.val();
        html += `<div class="msg-bubble">${v.text}</div>`;
    });
    const box = document.getElementById("chatMessages");
    box.innerHTML = html || "<div class='msg-bubble'>Welcome to the Kissan Chat. Start the conversation!</div>";
    box.scrollTop = box.scrollHeight; // Auto-scroll to bottom
});