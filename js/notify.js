import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';
import notifyConverter from './notifyClass.js';

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
      processRole(employee);
      /* End phần Quản lý thong bao */


    } else {
      console.log("No such document!");
    }
  } else {
    console.log("Chưa đăng nhập");
    const logout = document.getElementById("log");
    logout.addEventListener("click", loginEmail);
  }

  const querySnapshot = await getDocs(collection(db, "notify").withConverter(notifyConverter));
  querySnapshot.forEach((doc) => {
      const notify = doc.data(); 
      createItemNotify(notify);
      console.log(doc.id, " => ", notify.getReName());
  });

  
});
//Xử lý
async function getContent(event) {
  const datav = event.target.innerText;
  console.log(datav);
  const q = query(collection(db, "notify"), where("name", "==", datav)).withConverter(notifyConverter);
  const querySnapshot = await getDocs(q); 
  querySnapshot.forEach((doc) => {
    const notifyItem = doc.data(); 
    setDetailNotify(notifyItem);
    console.log(doc.id, " => ", notifyItem.getContent());
  });
}

function setDetailNotify(notifyItem){
  const right=document.getElementById("right");
  const name = document.getElementById("name");
  const date = document.getElementById("date");
  const content = document.getElementById("content");
  const link = document.getElementById("link");

  name.innerHTML=notifyItem.getReName();
  date.innerHTML=notifyItem.getDate();
  content.innerHTML=notifyItem.getContent();
  link.href=notifyItem.getReName();
  right.style.display="block"
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
    const name = document.createElement("h3");
    const date = document.createElement("p");

    node.className="item";
    node.style.listStyle="none";
    name.innerText=notify.getReName();
    name.className="name_no";
    name.onclick=getContent;
    date.innerText=notify.getDate();

    node.appendChild(name);
    node.appendChild(date);

    document.getElementById("left").appendChild(node);
    console.log(node);
}

/* Start phần Quản lý thong bao */
function manageNotify() {
  const edit = document.getElementById("edit");
  const edit_item_name = document.getElementById("edit_item_name");
  const edit_item_content = document.getElementById("edit_item_content");
  const edit_item_link = document.getElementById("edit_item_link");
  const e_name = document.getElementById("e_name");
  const e_content = document.getElementById("e_content");
  const e_link = document.getElementById("e_link"); 
  const search = document.getElementById("search");
  const cancel = document.getElementById("cancel");
  const confirm_add = document.getElementById("confirm_add");
  const confirm_update= document.getElementById("confirm_update");
  const confirm_delete = document.getElementById("confirm_delete");

  document.getElementById("add").addEventListener("click", function(){
    console.log("add");
    edit.style.display="block"; 
    edit.style.backgroundColor="#ecfcea";
    edit_item_name.style.display="block";
    edit_item_content.style.display="block";
    edit_item_link.style.display="block";
    search.style.display="none"; 
    cancel.style.display="block"; 
    confirm_add.style.display="block"; 
    confirm_update.style.display="none"; 
    confirm_delete.style.display="none"; 
    
    cancel.addEventListener("click", function(){
      edit.style.display="none";
    });
    confirm_add.addEventListener("click", async function(){
      const currentDate=new Date();
      const docRef = await addDoc(collection(db, "notify"), {
        name: e_name.value,
        content: e_content.value,
        link: e_link.value,
        date: currentDate.toString(),
      });
      location.reload();
    });
  });

  document.getElementById("update").addEventListener("click", function(){
    console.log("update");
    edit.style.display="block"; 
    edit.style.backgroundColor="#eaf4fc";
    edit_item_name.style.display="block";
    edit_item_content.style.display="none";
    edit_item_link.style.display="none";
    search.style.display="block"; 
    cancel.style.display="block";
    confirm_add.style.display="none"; 
    confirm_update.style.display="none"; 
    confirm_delete.style.display="none"; 
    
    cancel.addEventListener("click", function(){
      edit.style.display="none";
    });
    search.addEventListener("click", async function(){
      const q = query(collection(db, "notify"), where("name", "==", e_name.value)).withConverter(notifyConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docReg) => {
        const notifyItem = docReg.data();
        const notifyId=docReg.id; 
        console.log(docReg.id, " => ", notifyItem);
        edit_item_content.style.display="block";
        e_content.value=notifyItem.getContent();
        edit_item_link.style.display="block";
        e_link.value=notifyItem.getLink();
        search.style.display="none";
        confirm_update.style.display="block";
        confirm_add.style.display="none";
        confirm_delete.style.display="none";   
        confirm_update.addEventListener("click", async function(){
          const currentDate=new Date();
          const docRef = doc(db, "notify", notifyId);
          await updateDoc(docRef, {
            name: e_name.value,
            content: e_content.value,
            link: e_link.value,
            date: currentDate.toString(),
          });
          location.reload();
        });
      });
    });
  });
  document.getElementById("delete").addEventListener("click", function(){
    console.log("delete");
    edit.style.display="block"; 
    edit.style.backgroundColor="#f9e5e5";
    edit_item_name.style.display="block";
    edit_item_content.style.display="none";
    edit_item_link.style.display="none";
    search.style.display="block"; 
    cancel.style.display="block";
    confirm_add.style.display="none"; 
    confirm_update.style.display="none"; 
    confirm_delete.style.display="none"; 
    
    cancel.addEventListener("click", function(){
      edit.style.display="none";
    });
    search.addEventListener("click", async function(){
      const q = query(collection(db, "notify"), where("name", "==", e_name.value)).withConverter(notifyConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docReg) => {
        const notifyItem = docReg.data();
        const notifyId=docReg.id; 
        console.log(docReg.id, " => ", notifyItem);
        edit_item_content.style.display="block";
        e_content.value=notifyItem.getContent();
        edit_item_link.style.display="block";
        e_link.value=notifyItem.getLink();
        search.style.display="none";
        confirm_update.style.display="none";
        confirm_add.style.display="none";
        confirm_delete.style.display="block";   
        confirm_delete.addEventListener("click", async function(){
          await deleteDoc(doc(db, "notify", notifyId));
          location.reload();
        });
      });
    });    
  });
}
function processRole(employee) {
  if(employee.getRole()=="Admin"){
    document.getElementById("manage_notify").style.display="block";
    manageNotify();
  }
}
/* End phần Quản lý thong bao */


