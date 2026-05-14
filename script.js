// ===============================
// FIREBASE INITIALIZATION
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
    authDomain: "kissan-smart1.firebaseapp.com",
    databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com",
    projectId: "kissan-smart1",
    storageBucket: "kissan-smart1.firebasestorage.app",
    messagingSenderId: "574407446300",
    appId: "1:574407446300:web:5ce3ee98c54250d80e34d9",
    measurementId: "G-Q77S74Y8Y9"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const analytics = firebase.analytics();

console.log("Kissan Smart Firebase Connected ✅");


// ===============================
// LANGUAGE TOGGLE
// ===============================

let currentLang = "en";

const translations = {

    en: {

        heroTitle: "Empowering the Farmers of Pakistan",

        heroMoto: '"Khushhal Kissan, Mazboot Pakistan"',

        navWeather: "Weather",

        navMandi: "Mandi Rates",

        navSchemes: "Govt Schemes",

        navCommunity: "Community",

        weatherHeading: "Live Weather Tracker",

        weatherBtn: "Check Weather",

        weatherPlaceholder: "e.g., Multan, Lahore, Faisalabad",

        cropsHeading: "Manage Your Crops",

        cropPlaceholder: "Enter Crop Name",

        mandiHeading: "Live Mandi Market (Punjab)",

        chatHeading: "Farmer Community Chat",

        reviewHeading: "Farmer Reviews",

        footerText:
            "Your digital agriculture partner empowering farmers with technology."
    },

    ur: {

        heroTitle: "پاکستان کے کسانوں کو بااختیار بنانا",

        heroMoto: '"خوشحال کسان، مضبوط پاکستان"',

        navWeather: "موسم",

        navMandi: "منڈی ریٹس",

        navSchemes: "حکومتی اسکیمیں",

        navCommunity: "کمیونٹی",

        weatherHeading: "لائیو موسم ٹریکر",

        weatherBtn: "موسم دیکھیں",

        weatherPlaceholder: "مثلاً ملتان، لاہور، فیصل آباد",

        cropsHeading: "اپنی فصلیں منظم کریں",

        cropPlaceholder: "فصل کا نام درج کریں",

        mandiHeading: "لائیو منڈی مارکیٹ (پنجاب)",

        chatHeading: "کسان کمیونٹی چیٹ",

        reviewHeading: "کسانوں کے تاثرات",

        footerText:
            "ٹیکنالوجی کے ذریعے کسانوں کو بااختیار بنانے والا ڈیجیٹل زرعی پلیٹ فارم۔"
    }
};

function toggleLanguage() {

    currentLang = currentLang === "en" ? "ur" : "en";

    const t = translations[currentLang];

    document.getElementById("hero-title").innerText =
        t.heroTitle;

    document.getElementById("hero-moto").innerText =
        t.heroMoto;

    document.getElementById("nav-weather").innerText =
        t.navWeather;

    document.getElementById("nav-mandi").innerText =
        t.navMandi;

    document.getElementById("nav-schemes").innerText =
        t.navSchemes;

    document.getElementById("nav-community").innerText =
        t.navCommunity;

    document.getElementById("weather-heading").innerHTML =
        `<img src="weather.png" class="icon"> ${t.weatherHeading}`;

    document.getElementById("weather-btn").innerText =
        t.weatherBtn;

    document.getElementById("cityInput").placeholder =
        t.weatherPlaceholder;

    document.getElementById("crops-heading").innerHTML =
        `<img src="wheat.png" class="icon"> ${t.cropsHeading}`;

    document.getElementById("cropName").placeholder =
        t.cropPlaceholder;

    document.getElementById("mandi-heading").innerHTML =
        `<img src="analytics.png" class="icon"> ${t.mandiHeading}`;

    document.getElementById("chat-heading").innerHTML =
        `<img src="chat.png" class="icon"> ${t.chatHeading}`;

    document.getElementById("review-heading").innerHTML =
        `<img src="good-feedback.png" class="icon"> ${t.reviewHeading}`;

    document.getElementById("footer-text").innerText =
        t.footerText;

    document.body.style.direction =
        currentLang === "ur" ? "rtl" : "ltr";

    document.body.style.textAlign =
        currentLang === "ur" ? "right" : "left";

    document.getElementById("lang-btn").innerText =
        currentLang === "ur" ? "EN" : "اردو";
}


// ===============================
// BROWSER NOTIFICATIONS
// ===============================

function enableNotifications() {

    if (!("Notification" in window)) {

        alert("Browser does not support notifications");

    } else if (Notification.permission === "granted") {

        new Notification("Kissan Smart", {
            body: "Notifications already enabled"
        });

    } else if (Notification.permission !== "denied") {

        Notification.requestPermission().then(permission => {

            if (permission === "granted") {

                new Notification("Welcome!", {
                    body: "Weather and mandi alerts enabled"
                });
            }
        });
    }
}


// ===============================
// WEATHER API
// ===============================

async function getWeather() {

    const city =
        document.getElementById("cityInput").value || "Multan";

    const apiKey =
        "416cd6ed6380471e42e8bfeb624c1708";

    const display =
        document.getElementById("weather-display");

    display.innerText = "Fetching weather...";

    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},PK&appid=${apiKey}&units=metric`
        );

        if (!res.ok)
            throw new Error("City not found");

        const data = await res.json();

        display.innerHTML = `
            📍 <b>${data.name}</b><br>
            🌡 ${data.main.temp}°C<br>
            💧 Humidity: ${data.main.humidity}%<br>
            ☁ ${data.weather[0].description}
        `;

    } catch (error) {

        display.innerHTML =
            "❌ Failed to fetch weather";
    }
}


// ===============================
// CROP MANAGEMENT
// ===============================

let crops = [];

function addCrop() {

    const name =
        document.getElementById("cropName").value;

    const date =
        document.getElementById("sowingDate").value;

    if (name && date) {

        crops.push({ name, date });

        renderCrops();

        document.getElementById("cropName").value = "";

        document.getElementById("sowingDate").value = "";

    } else {

        alert("Please fill all fields");
    }
}

function renderCrops() {

    const list =
        document.getElementById("cropList");

    list.innerHTML = crops.map(crop => `

        <div style="
            background:#e8f5e9;
            padding:12px;
            margin-top:10px;
            border-radius:8px;
            border-left:5px solid #2e7d32;
        ">
            <b>${crop.name}</b><br>
            Sowing Date: ${crop.date}
        </div>

    `).join("");
}


// ===============================
// LIVE MANDI API + CHART
// ===============================

let mandiChart;

async function fetchMandiRates() {

    const mandiBody =
        document.getElementById("mandi-body");

    mandiBody.innerHTML = `
        <tr>
            <td colspan="3">
                Loading live mandi rates...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            "https://api.npoint.io/2e0f5f7f6db9f0f4b2ab"
        );

        const data = await response.json();

        let html = "";

        const chartLabels = [];
        const chartPrices = [];

        data.forEach(item => {

            html += `
                <tr>
                    <td>${item.city}</td>
                    <td>${item.crop}</td>
                    <td>Rs. ${item.price}</td>
                </tr>
            `;

            chartLabels.push(item.crop);

            chartPrices.push(item.price);
        });

        mandiBody.innerHTML = html;

        updateChart(chartLabels, chartPrices);

    } catch (error) {

        console.error(error);

        mandiBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Failed to load mandi data
                </td>
            </tr>
        `;
    }
}

function updateChart(labels, prices) {

    const ctx =
        document.getElementById("mandiChart")
        .getContext("2d");

    if (mandiChart) {
        mandiChart.destroy();
    }

    mandiChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Crop Prices (PKR)",

                data: prices,

                backgroundColor: [
                    "#2e7d32",
                    "#388e3c",
                    "#43a047",
                    "#4caf50",
                    "#66bb6a"
                ],

                borderRadius: 8
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// ===============================
// LIVE CHAT
// ===============================

function sendMessage() {

    const input =
        document.getElementById("chatInput");

    const msg = input.value;

    if (msg.trim() !== "") {

        db.ref("chat").push({

            text: msg,

            timestamp: Date.now()

        }).then(() => {

            input.value = "";

        }).catch(error => {

            console.error(error);
        });
    }
}

db.ref("chat").on("value", snap => {

    let html = "";

    snap.forEach(m => {

        const v = m.val();

        html += `
            <div class="msg-bubble">
                ${v.text}
            </div>
        `;
    });

    const box =
        document.getElementById("chatMessages");

    box.innerHTML =
        html ||
        "<div class='msg-bubble'>Start chatting...</div>";

    box.scrollTop = box.scrollHeight;
});

document.getElementById("chatInput")
.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();
    }
});


// ===============================
// REVIEWS
// ===============================

let currentRating = 0;

function setRating(rating) {

    currentRating = rating;

    const stars =
        document.querySelectorAll(".rating span");

    stars.forEach((star, index) => {

        star.classList.toggle(
            "active",
            index < rating
        );
    });
}

function submitReview() {

    const name =
        document.getElementById("reviewName").value;

    const comment =
        document.getElementById("reviewComment").value;

    if (!name || !comment || currentRating === 0) {

        alert("Please complete all fields");

        return;
    }

    const review = {

        name,

        comment,

        rating: currentRating
    };

    saveReview(review);

    displayReviews();

    document.getElementById("reviewName").value = "";

    document.getElementById("reviewComment").value = "";

    setRating(0);
}

function saveReview(review) {

    let reviews =
        JSON.parse(localStorage.getItem("reviews"))
        || [];

    reviews.push(review);

    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );
}

function displayReviews() {

    const container =
        document.getElementById("reviewsList");

    const reviews =
        JSON.parse(localStorage.getItem("reviews"))
        || [];

    container.innerHTML = "";

    reviews.reverse().forEach(r => {

        const div =
            document.createElement("div");

        div.className = "review-card";

        div.innerHTML = `
            <h4>${r.name}</h4>
            <div class="stars">
                ${"★".repeat(r.rating)}
            </div>
            <p>${r.comment}</p>
        `;

        container.appendChild(div);
    });
}


// ===============================
// ADMIN PANEL
// ===============================

const ADMIN_PASSWORD = "12345";

function loginAdmin() {

    const input =
        document.getElementById("adminPass").value;

    if (input === ADMIN_PASSWORD) {

        document.getElementById(
            "adminControls"
        ).style.display = "block";

        loadAdminReviews();

    } else {

        alert("Wrong password");
    }
}

function loadAdminReviews() {

    const container =
        document.getElementById("adminReviews");

    let reviews =
        JSON.parse(localStorage.getItem("reviews"))
        || [];

    container.innerHTML = "";

    reviews.forEach((r, index) => {

        const div =
            document.createElement("div");

        div.className = "review-card";

        div.innerHTML = `
            <h4>${r.name}</h4>

            <div class="stars">
                ${"★".repeat(r.rating)}
            </div>

            <p>${r.comment}</p>

            <button
                class="delete-btn"
                onclick="deleteReview(${index})"
            >
                Delete
            </button>
        `;

        container.appendChild(div);
    });
}

function deleteReview(index) {

    let reviews =
        JSON.parse(localStorage.getItem("reviews"))
        || [];

    if (confirm("Delete this review?")) {

        reviews.splice(index, 1);

        localStorage.setItem(
            "reviews",
            JSON.stringify(reviews)
        );

        loadAdminReviews();

        displayReviews();
    }
}


// ===============================
// PAGE LOAD
// ===============================

window.onload = () => {

    displayReviews();

    fetchMandiRates();

    getWeather();
};