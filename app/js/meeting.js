import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';
import meetingConverter from './meetingClass.js';

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
      console.log(employee.toString()); 
      const logout = document.getElementById("log");
      logout.src = './img/img_logout.png';
      logout.addEventListener("click", logoutEmail);
    
      /* Start phần Quản lý thong bao */
      processRole(employee, uid);
      /* End phần Quản lý thong bao */
    
      const cDate= new Date().toString().slice(0,15);
      console.log(cDate);
      const q = query(collection(db, "meeting"), where("date", "==", cDate)).withConverter(meetingConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const meetingItem = doc.data();
        createItemMeeting(meetingItem);
        console.log(doc.id, " => ", meetingItem);
      });
      
    
      

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
function createItemMeeting(meeting) {
    const node = document.createElement("div");
    const name = document.createElement("h3");
    const time = document.createElement("p");
    const labe1 = document.createElement("p");
    const emp = document.createElement("p");
    

    node.className="item";
    name.innerText=meeting.getReName();
    name.className="name";
    time.innerText=meeting.getTime();
    time.className="time";
    labe1.innerText="Mã nhân viên đặt phòng:";
    labe1.className="labe1";
    emp.innerText=meeting.getEmp();
    emp.className="emp";

    node.appendChild(name);
    node.appendChild(time);
    node.appendChild(labe1);
    node.appendChild(emp);

    document.getElementById("meeting").appendChild(node);
    console.log(node);
}

/* Start phần Quản lý thong bao */
function manageMeeting(uid) {
  const edit = document.getElementById("edit");
  const edit_item_name = document.getElementById("edit_item_name");
  const edit_item_time = document.getElementById("edit_item_time");
  const consol = document.getElementById("consol");
  const e_name = document.getElementsByName("e_name");
  const e_time = document.getElementsByName("e_time");
  const cancel = document.getElementById("cancel");
  const confirm_add = document.getElementById("confirm_add");
  const confirm_update= document.getElementById("confirm_update");
  const confirm_delete = document.getElementById("confirm_delete");

  document.getElementById("add").addEventListener("click", function(){
    console.log("add");
    edit.style.display="block"; 
    edit.style.backgroundColor="#ecfcea";
    edit_item_name.style.display="block";
    edit_item_time.style.display="block";
    cancel.style.display="block"; 
    confirm_add.style.display="block"; 
    confirm_update.style.display="none"; 
    confirm_delete.style.display="none"; 

    var selectedName="none";
    var selectedTime="none";
    for (var i = 0; i < e_name.length; i++) {
      e_name[i].addEventListener("change", function(event){
        selectedName = event.target.value;
        console.log(selectedName);
      });
    }
    for (var i = 0; i < e_time.length; i++) {
      e_time[i].addEventListener("change", function(event){
        selectedTime = event.target.value;
        console.log(selectedTime);
      });
    }
    
    cancel.addEventListener("click", function(){
      edit.style.display="none";
    });
    if(selectedName!="none" && selectedTime!="none"){
      
      confirm_add.addEventListener("click", async function(){
        const currentDate=new Date();
        const docRef = await addDoc(collection(db, "meeting"), {
          name: selectedName,
          date: currentDate.toString().slice(0,15),
          time: selectedTime,
          emp: uid,
        });
        location.reload();
      });
    }
  });

  document.getElementById("delete").addEventListener("click", function(){
    console.log("delete");
    edit.style.display="block"; 
    edit.style.backgroundColor="#f9e5e5";
    edit_item_name.style.display="none";
    edit_item_time.style.display="none";
    cancel.style.display="block"; 
    confirm_add.style.display="none"; 
    confirm_update.style.display="none"; 
    confirm_delete.style.display="block"; 
    consol.innerText="Bạn có chắc là muốn hóa hết lịch đặt phòng hôm nay của bạn?";
    
    cancel.addEventListener("click", function(){
      edit.style.display="none";
    });
    confirm_delete.addEventListener("click", async function(){
      await deleteDoc(doc(db, "meeting", uid));
      location.reload();
    });   
  });


}
function processRole(employee, uid) {
  if(employee.getRole()=="Top" || employee.getRole()=="Middle"){
    document.getElementById("manage_meeting").style.display="block";
    manageMeeting(uid);
  }
}
/* End phần Quản lý thong bao */


