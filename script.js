// --- DATABASE & APP CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
  authDomain: "kissan-smart1.firebaseapp.com",
  projectId: "kissan-smart1",
  storageBucket: "kissan-smart1.firebasestorage.app",
  messagingSenderId: "574407446300",
  appId: "1:574407446300:web:5ce3ee98c54250d80e34d9",
  databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com" // From your Realtime DB setup
};

// Initialize Services
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- REAL-TIME FARMER CHAT ---
function sendChatMessage() {
    const name = document.getElementById('userName').value || "Farmer";
    const msg = document.getElementById('userMsg').value;
    if(!msg) return;

    database.ref('community_chat').push().set({
        username: name,
        text: msg,
        timestamp: Date.now()
    });
    document.getElementById('userMsg').value = '';
}

// Sync messages across all farmers instantly
database.ref('community_chat').limitToLast(15).on('value', (snapshot) => {
    const chatDisplay = document.getElementById('chatMessages');
    chatDisplay.innerHTML = '';
    snapshot.forEach((child) => {
        const data = child.val();
        chatDisplay.innerHTML += `<div class="msg"><b>${data.username}:</b> ${data.text}</div>`;
    });
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// --- REAL-TIME DISEASE DIAGNOSIS (KINDWISE API) ---
async function detectDisease() {
    const fileInput = document.getElementById('leafUpload');
    const resDiv = document.getElementById('diseaseResult');
    if (fileInput.files.length === 0) return alert("Please select a leaf photo!");

    resDiv.style.display = 'block';
    resDiv.innerHTML = "<strong>Analyzing leaf health...</strong>";

    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        // Using your API URL from image_2cedc4.png
        const apiUrl = "https://crop.kindwise.com/api/v1/identification"; 
        const apiKey = "k8jG2m7IOxR754GN9GswRWlfRKMZCgrTBHy6uAZ811PdI1si2J"; // Click 'Show key' in image_2cedc4.png

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({ images: [base64Image], latitude: 30.3753, longitude: 69.3451 }) // Pakistan coordinates
            });

            const data = await response.json();
            const diagnosis = data.result.disease.suggestions[0];
            
            resDiv.innerHTML = `
                <strong>Diagnosis:</strong> ${diagnosis.name}<br>
                <strong>Confidence:</strong> ${(diagnosis.probability * 100).toFixed(1)}%<br>
                <strong>Treatment Advice:</strong> Scientific irrigation scheduling recommended.
            `;
        } catch (error) {
            resDiv.innerHTML = "Connection error. Please try again.";
        }
    };
}