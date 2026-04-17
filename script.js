// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
    authDomain: "kissan-smart1.firebaseapp.com",
    projectId: "kissan-smart1",
    databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com", // Ensure this matches your console
    appId: "1:574407446300:web:5ce3ee98c54250d80e34d9"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- COMMUNITY CHAT LOGIC ---
function sendChatMessage() {
    const name = document.getElementById('userName').value || "Farmer";
    const msg = document.getElementById('userMsg').value;
    if(!msg) return;

    database.ref('chat').push().set({
        username: name,
        text: msg,
        time: Date.now()
    });
    document.getElementById('userMsg').value = '';
}

database.ref('chat').limitToLast(10).on('value', (snapshot) => {
    const display = document.getElementById('chatMessages');
    display.innerHTML = '';
    snapshot.forEach((child) => {
        const data = child.val();
        display.innerHTML += `<p><b>${data.username}:</b> ${data.text}</p>`;
    });
});

// --- SCIENTIFIC DISEASE DIAGNOSIS (REAL-TIME) ---
async function detectDisease() {
    const fileInput = document.getElementById('leafUpload');
    const res = document.getElementById('diseaseResult');
    if (!fileInput.files[0]) return alert("Please upload a photo!");

    res.innerHTML = "Working with Crop.Health AI...";
    
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        try {
            const response = await fetch("https://crop.kindwise.com/api/v1/identification", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Api-Key": "k8jG2m7lOxR754GN9GswRWlfRKMZCgrTBHy6uAZ811Pdl1si2J" // Your live key
                },
                body: JSON.stringify({
                    images: [base64Image],
                    latitude: 30.3753, // Punjab coordinates
                    longitude: 69.3451
                })
            });

            const data = await response.json();
            const result = data.result.disease.suggestions[0];
            
            res.innerHTML = `
                <h3>Result: ${result.name}</h3>
                <p>Confidence: ${(result.probability * 100).toFixed(1)}%</p>
                <p><i>Scientific Note: Use CropManage for irrigation scheduling based on this diagnosis.</i></p>
            `;
        } catch (err) {
            res.innerHTML = "Error connecting to AI server.";
        }
    };
}