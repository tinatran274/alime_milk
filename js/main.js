import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';
import notifyConverter from './notifyClass.js';
import newsConverter from './newsClass.js';


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
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);
    console.log("Đã đăng nhập với id: " + uid);
    const docRef = doc(db, "users", uid).withConverter(employeeConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const employee = docSnap.data();
      console.log(employee.toString()); 
      document.getElementById("greeting").innerHTML = "Xin chào, "+employee.getRename();   
      const logout = document.getElementById("log");
      logout.src = './img/img_logout.png';
      logout.addEventListener("click", logoutEmail);

      const currentDate=new Date();
      const userDate=new Date(employee.getAge());
      console.log(currentDate.getDate()+ " " + currentDate.getMonth()+" +  "+userDate.getDate()+" "+userDate.getMonth());
      if(currentDate.getMonth()==userDate.getMonth() && currentDate.getDate()==userDate.getDate()){
        document.getElementById("cheer").innerHTML="Hôm nay là "+currentDate+". Chúc mừng sinh nhật "+employee.getRename();
        document.getElementById("birthday").style.display="block";
      }

    } else {
      console.log("No such document!");
    }
  } else {
    console.log("Chưa đăng nhập");
    const logout = document.getElementById("log");
    logout.addEventListener("click", loginEmail);
  }
  const querySnapshot = await getDocs(collection(db, "notify").withConverter(notifyConverter));
  querySnapshot.forEach(async (doc) => {
      const notify = doc.data(); 
      createItemNotify(notify);
      console.log(doc.id, " => ", notify.getReName());

  });
});
//Xử lý
let slideIndex = 0;
showSlides();
function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function movePage(url) {
  window.location.href = url;
}

function logoutEmail() {
  signOut(auth).then(() => {
    console.log("Đăng xuất thành công");
    movePage("login.html");
  }).catch((error) => {
    console.log("Đăng xuất không thành công");
  });
}
function loginEmail() {
  movePage("login.html");
}
function createItemNotify(notify) {
  const node = document.createElement("li");
  const name = document.createElement("a");

  node.className="notify_item";
  name.innerText=notify.getReName();
  name.href="notify.html";

  node.appendChild(name);

  document.getElementById("notify").appendChild(node);
  console.log(node);
}
