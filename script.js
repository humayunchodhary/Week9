// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
    authDomain: "kissan-smart1.firebaseapp.com",
    projectId: "kissan-smart1",
    databaseURL: "https://kissan-smart1-default-rtdb.firebaseio.com",
    appId: "1:574407446300:web:5ce3ee98c54250d80e34d9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();


// DARK MODE
document.getElementById("theme-toggle").onclick = () => {
    const t = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", t === "dark" ? "light" : "dark");
};


// LANGUAGE
let lang="en";

function toggleLanguage(){
    lang = lang==="en"?"ur":"en";

    document.getElementById("hero-title").innerText =
    lang==="en"?"Welcome to Pakistan's Smart Farming Platform":"پاکستان کا اسمارٹ فارمنگ پلیٹ فارم";
}


// WEATHER
async function getWeather(){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Multan,PK&appid=416cd6ed6380471e42e8bfeb624c1708&units=metric`);
    const data = await res.json();

    document.getElementById("weather-data").innerHTML =
    `${data.main.temp}°C | ${data.weather[0].description}`;
}
getWeather();


// CROPS
function addCrop(){
    const name=document.getElementById("cropName").value;
    const date=document.getElementById("sowingDate").value;

    if(name && date){
        db.ref("crops").push({name,date});
    }
}

db.ref("crops").on("value",snap=>{
    let html="";
    snap.forEach(c=>{
        const v=c.val();
        html+=`<div class="card">${v.name} - ${v.date}</div>`;
    });
    document.getElementById("cropList").innerHTML=html;
});


// MANDI
db.ref("mandiRates").on("value",snap=>{
    let html="";
    snap.forEach(c=>{
        const v=c.val();
        html+=`<div class="card"><b>${v.name}</b> → ${v.price} per 40 kg</div>`;
    });
    document.getElementById("mandiList").innerHTML=html;
});


// CHAT SYSTEM (REAL-TIME)
function sendMessage(){
    const msg=document.getElementById("chatInput").value;

    if(msg.trim()!==""){
        db.ref("chat").push({
            text:msg,
            time:Date.now()
        });
        document.getElementById("chatInput").value="";
    }
}

db.ref("chat").on("value",snap=>{
    let html="";
    snap.forEach(m=>{
        const v=m.val();
        html+=`<div class="message">${v.text}</div>`;
    });

    const box=document.getElementById("chatMessages");
    box.innerHTML=html;
    box.scrollTop=box.scrollHeight;
});


// DISEASE
async function detectDisease(){
    const file=document.getElementById("leafUpload").files[0];
    if(!file) return;

    const reader=new FileReader();
    reader.readAsDataURL(file);

    reader.onload=async ()=>{
        const base64=reader.result.split(",")[1];

        const res=await fetch("https://crop.kindwise.com/api/v1/identification",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Api-Key":"k8jG2m7lOxR754GN9GswRWlfRKMZCgrTBHy6uAZ811Pdl1si2J"
            },
            body:JSON.stringify({images:[base64]})
        });

        const data=await res.json();
        const r=data.result.disease.suggestions[0];

        document.getElementById("diseaseResult").innerHTML =
        `${r.name} (${(r.probability*100).toFixed(1)}%)`;
    };
}