import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, setDoc  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8AiULqogvlj7q8dYeGenKh5Ssgd_R8A0",
  authDomain: "alime-49c09.firebaseapp.com",
  projectId: "alime-49c09",
  storageBucket: "alime-49c09.appspot.com",
  messagingSenderId: "536978833958",
  appId: "1:536978833958:web:c05f3e8959c2cb10a09ce7",
  measurementId: "G-NG3C71QBV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//addEvent
document.getElementById("login").addEventListener("click", loginEmail);
document.getElementById("cancel").addEventListener("click", inNotLoginPage);

//Function
function movePage(url) {
  window.location.href = url;
}

function inNotLoginPage() {
  movePage("index.html");
}

function loginEmail() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    alert("Đăng nhập thành công");
    movePage("main.html");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Không tồn tại tài khoản");
  });
  
}
