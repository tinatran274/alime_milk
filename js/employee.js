import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';

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
    console.log("Đã đăng nhập với id: " + uid);
    const docRef = doc(db, "users", uid).withConverter(employeeConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const employee = docSnap.data();
      setUserInfo(employee,uid);
      console.log(employee.toString()); 
      const logout = document.getElementById("log");
      logout.src = './img/img_logout.png';
      logout.addEventListener("click", logoutEmail);



    } else {
      console.log("No such document!");
    }
  } else {
    console.log("Chưa đăng nhập");
    const logout = document.getElementById("log");
    logout.addEventListener("click", loginEmail);
  }
});
//Xử lý
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

function setUserInfo(employee, uid) {

  const btn_edit=document.getElementById("edit_info");
  const btn_cancel=document.getElementById("cancel");
  const btn_confirm=document.getElementById("confirm");

  btn_edit.style.display="block";
  btn_edit.addEventListener("click", function(){
    document.getElementById("edit").style.display="block"; 
  });
  btn_cancel.addEventListener("click", function(){
    document.getElementById("edit").style.display="none"; 
  });
  btn_confirm.addEventListener("click", async function(){
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      name: document.getElementById("e_name").value,
      age: document.getElementById("e_age").value,
      phone: document.getElementById("e_phone").value,
      address: document.getElementById("e_address").value,
    });
    location.reload();
  });

  document.getElementById("e_name").value=employee.getRename();
  document.getElementById("e_age").value=employee.getAge();
  document.getElementById("e_phone").value=employee.getPhone();
  document.getElementById("e_address").value=employee.getAddress();

  document.getElementById("name").innerHTML="1. Họ và tên: "+employee.getRename();
  document.getElementById("age").innerHTML="2. Ngày tháng năm sinh: "+employee.getAge();
  document.getElementById("phone").innerHTML="3. Số điện thoại: "+employee.getPhone();
  document.getElementById("address").innerHTML="4. Địa chỉ: "+employee.getAddress();
  document.getElementById("role").innerHTML="5. Chức vụ: "+employee.getRole();
  document.getElementById("unit").innerHTML="6. Đơn vị làm việc: "+employee.getUnit();

}


