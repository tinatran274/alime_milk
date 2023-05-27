import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';
import ruleConverter from './ruleClass.js';

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

      const querySnapshot = await getDocs(collection(db, "rule").withConverter(ruleConverter));
        querySnapshot.forEach((doc) => {
            const rule = doc.data(); 
            createItemRule(rule);
            console.log(doc.id, " => ", rule.getReName());
        });
      /* Start phần Quản lý quy định */
      processRole(employee);
      /* End phần Quản lý quy định */
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
function createItemRule(rule) {
    const node = document.createElement("li");
    const name = document.createElement("h4");
    const content = document.createElement("p");
    const image = document.createElement("img");
    const link = document.createElement("a");

    name.innerText=rule.getReName();
    content.innerText=rule.getContent();
    link.innerText="Click vào để tải về";
    link.href=rule.getLink();
    image.src='./img/img_link.png';


    node.appendChild(name);
    node.appendChild(content);
    node.appendChild(image);
    node.appendChild(link);
    document.getElementById("list").appendChild(node);
    console.log(node);
}

/* Start phần Quản lý quy định */
function manageRule() {
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
      const docRef = await addDoc(collection(db, "rule"), {
        name: e_name.value,
        content: e_content.value,
        link: e_link.value,
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
      const q = query(collection(db, "rule"), where("name", "==", e_name.value)).withConverter(ruleConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docReg) => {
        const ruleItem = docReg.data();
        const ruleId=docReg.id; 
        console.log(docReg.id, " => ", ruleItem);
        edit_item_content.style.display="block";
        e_content.value=ruleItem.getContent();
        edit_item_link.style.display="block";
        e_link.value=ruleItem.getLink();
        search.style.display="none";
        confirm_update.style.display="block";
        confirm_add.style.display="none";
        confirm_delete.style.display="none";   
        confirm_update.addEventListener("click", async function(){
          const docRef = doc(db, "rule", ruleId);
          await updateDoc(docRef, {
            name: e_name.value,
            content: e_content.value,
            link: e_link.value,
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
      const q = query(collection(db, "rule"), where("name", "==", e_name.value)).withConverter(ruleConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docReg) => {
        const ruleItem = docReg.data();
        const ruleId=docReg.id; 
        console.log(docReg.id, " => ", ruleItem);
        edit_item_content.style.display="block";
        e_content.value=ruleItem.getContent();
        edit_item_link.style.display="block";
        e_link.value=ruleItem.getLink();
        search.style.display="none";
        confirm_update.style.display="none";
        confirm_add.style.display="none";
        confirm_delete.style.display="block";   
        confirm_delete.addEventListener("click", async function(){
          await deleteDoc(doc(db, "rule", ruleId));
          location.reload();
        });
      });
    });    
  });
}
function processRole(employee) {
  if(employee.getRole()=="Admin"){
    document.getElementById("manage_rule").style.display="block";
    manageRule();
  }
}
/* End phần Quản lý định */


