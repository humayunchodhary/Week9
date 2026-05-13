const firebaseConfig = {
  apiKey: "AIzaSyB41ljtA75jA3Hq9H09BnggyC0mCzeqSC4",
  authDomain: "kissan-smart1.firebaseapp.com",
  projectId: "kissan-smart1",
  storageBucket: "kissan-smart1.firebasestorage.app",
  messagingSenderId: "574407446300",
  appId: "1:574407446300:web:5ce3ee98c54250d80e34d9"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function registerUser() {

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
     auth.createUserWithEmailAndPassword(email, password)

    .then((userCredential) => {

        alert("Registration Successful!");

        window.location.href = "login.html";
    })

    .catch((error) => {
        alert(error.message);
    });
}
function loginUser() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)

    .then(() => {

        alert("Login Successful!");

        window.location.href = "dashboard.html";
    })

    .catch((error) => {
        alert(error.message);
    });
}
function forgotPassword() {

    const email = prompt("Enter your registered email:");

    if(email) {

        auth.sendPasswordResetEmail(email)

        .then(() => {
            alert("Password reset email sent!");
        })

        .catch((error) => {
            alert(error.message);
        });
    }
}
function logoutUser() {

    auth.signOut()

    .then(() => {
        window.location.href = "login.html";
    });
}
auth.onAuthStateChanged((user) => {

    const currentPage = window.location.pathname;

    if(user) {

        if(currentPage.includes("login.html") ||
           currentPage.includes("register.html")) {

            window.location.href = "dashboard.html";
        }
    }

    else {

        if(currentPage.includes("dashboard.html")) {
            window.location.href = "login.html";
        }
    }
});