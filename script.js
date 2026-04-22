// --- FIREBASE INITIALIZATION (COMPAT VERSION) ---
const firebaseConfig = {
  apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
  authDomain: "kissan-smart1.firebaseapp.com",
  databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com", // This makes real-time work!
  projectId: "kissan-smart1",
  storageBucket: "kissan-smart1.firebasestorage.app",
  messagingSenderId: "574407446300",
  appId: "1:574407446300:web:5ce3ee98c54250d80e34d9",
  measurementId: "G-Q77S74Y8Y9"
};

// Initialize Firebase using the Compat mode
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const analytics = firebase.analytics(); // Optional

console.log("Kissan Smart Firebase Connected! ✅");

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
// --- 8. LIVE CHAT SYSTEM (Fixed & Corrected) ---
function sendMessage() {
    // Fixed the ID name here (was cchatInput)
    const inputField = document.getElementById("chatInput");
    const msg = inputField.value;
    
    if(msg.trim() !== "") {
        db.ref("chat").push({ 
            text: msg, 
            timestamp: Date.now() 
        })
        .then(() => {
            console.log("Message sent!");
            inputField.value = ""; // Clear input after sending
        })
        .catch((err) => {
            console.error("Chat error:", err);
        });
    }
}

// REAL-TIME LISTENER: This stays outside the sendMessage function
db.ref("chat").on("value", snap => {
    let html = "";
    snap.forEach(m => {
        const v = m.val();
        // Added a little style to the bubble so it's readable
        html += `<div class="msg-bubble" style="margin-bottom:10px; background:white; padding:10px; border-radius:10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    ${v.text}
                 </div>`;
    });
    const box = document.getElementById("chatMessages");
    if(box) {
        box.innerHTML = html || "<div class='msg-bubble'>Welcome to the Kissan Chat. Start the conversation!</div>";
        box.scrollTop = box.scrollHeight; // Auto-scroll to bottom
    }
});

// Bonus: Allow sending with 'Enter' key
document.getElementById("chatInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
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

let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll(".rating span");

    stars.forEach((star, index) => {
        star.classList.toggle("active", index < rating);
    });
}

function submitReview() {
    const name = document.getElementById("reviewName").value;
    const comment = document.getElementById("reviewComment").value;

    if (!name || !comment || currentRating === 0) {
        alert("Please fill all fields and select rating");
        return;
    }

    const review = {
        name,
        comment,
        rating: currentRating
    };

    saveReview(review);
    displayReviews();

    // Reset form
    document.getElementById("reviewName").value = "";
    document.getElementById("reviewComment").value = "";
    setRating(0);
}

function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function displayReviews() {
    const container = document.getElementById("reviewsList");
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    container.innerHTML = "";

    reviews.reverse().forEach(r => {
        const div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <h4>${r.name}</h4>
            <div class="stars">${"★".repeat(r.rating)}</div>
            <p>${r.comment}</p>
        `;

        container.appendChild(div);
    });
}

// Load reviews on page load
window.onload = displayReviews;


const ADMIN_PASSWORD = "12345"; // change this!

function loginAdmin() {
    const input = document.getElementById("adminPass").value;

    if (input === ADMIN_PASSWORD) {
        document.getElementById("adminControls").style.display = "block";
        loadAdminReviews();
    } else {
        alert("Wrong password!");
    }
}

function loadAdminReviews() {
    const container = document.getElementById("adminReviews");
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    container.innerHTML = "";

    reviews.forEach((r, index) => {
        const div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <h4>${r.name}</h4>
            <div class="stars">${"★".repeat(r.rating)}</div>
            <p>${r.comment}</p>
            <button class="delete-btn" onclick="deleteReview(${index})">Delete</button>
        `;

        container.appendChild(div);
    });
}

function deleteReview(index) {
    let reviews = JSON.parse(localStorage.getItem("reviewss")) || [];

    if (confirm("Delete this review?")) {
        reviews.splice(index, 1);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        loadAdminReviews();
        displayReviews(); // refresh public list
    }
}