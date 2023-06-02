import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore,  doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import employeeConverter from './employeeClass.js';
import sendingConverter from './sendingClass.js';

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
      const logout = document.getElementById("log");
      logout.src = './img/img_logout.png';
      logout.addEventListener("click", logoutEmail);
    
      /* Start phần Xử lý yêu cầu liên đơn vị */
      processRole(employee, uid);
      /* End phần Xử lý yêu cầu liên đơn vị */
      

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

function processRole(employee, uid) {
    if(employee.getRole()=="Top" || employee.getRole()=="Middle"){
      document.getElementById("manage_process").style.display="block";
      manageMail(employee, uid);
    }
  }
  async function manageMail(employee, uid) {
    const add_process = document.getElementById("add_process");
    const sent_process = document.getElementById("sent_process");;
    const edit_item_recipient = document.getElementById("edit_item_recipient");
    const edit_item_title = document.getElementById("edit_item_title");
    const edit_item_content = document.getElementById("edit_item_content");
    const e_recipient = document.getElementById("e_recipient");
    const e_title = document.getElementById("e_title");
    const e_content = document.getElementById("e_content");
    const search = document.getElementById("search");
    const cancel = document.getElementById("cancel");
    const send = document.getElementById("send");
    const found_user = document.getElementById("found_user");

    document.getElementById("add").addEventListener("click", function(){
      console.log("add");
      add_process.style.display="block"; 
      sent_process.style.display="none"; 
      edit_item_recipient.style.display="block"
      edit_item_title.style.display="none"
      edit_item_content.style.display="none"
      search.style.display="block"
      cancel.style.display="block"
      send.style.display="none"
      found_user.style.display="block"

      cancel.addEventListener("click", function(){
        add_process.style.display="none";
      });

      search.addEventListener("click", async function(){
        const q = query(collection(db, "users"), where("mail", "==", e_recipient.value)).withConverter(employeeConverter);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docReg) => {
          const recipientItem = docReg.data();
          //const recipientId=docReg.id; 
          console.log(docReg.id, " => ", recipientItem);
          edit_item_content.style.display="block";
          edit_item_title.style.display="block";
          search.style.display="none";
          send.style.display="block";
          found_user.innerHTML="Tên người nhận: "+recipientItem.getRename()+"<br>Đơn vị công tác: "+recipientItem.getUnit();
          
          send.addEventListener("click", async function(){
            const docRef = await addDoc(collection(db, "sending"), {
              recipient: recipientItem.getMail(),
              recipient_name: recipientItem.getRename(),
              title: e_title.value,
              content: e_content.value,
              sender: employee.getMail(),
              sender_name: employee.getRename(),
              time: new Date().toString(),
            });
            location.reload();
          });

        });
      });
    });

    
    const q = query(collection(db, "sending"), where("sender_name", "==", employee.getRename())).withConverter(sendingConverter);
      const querySnapshot = await getDocs(q); 
      querySnapshot.forEach((doc) => {
        const sendingItem = doc.data(); 
        createItemSending(sendingItem);
        console.log(doc.id, " => ", sendingItem);
      });
    document.getElementById("sent").addEventListener("click", function(){
      console.log("sent");
      add_process.style.display="none";
      sent_process.style.display="block";
    });
  }
  
  function createItemSending(sending) {
    const node = document.createElement("li");
    const receiver = document.createElement("p");
    const title = document.createElement("h3");
    const time = document.createElement("p");

    node.className="sent_item";
    receiver.innerText="Người nhận: "+sending.getRecipientName();
    receiver.className="receiver_name";
    //title.onclick=getContent;
    title.innerText=sending.getTitle();
    time.innerText=sending.getTime();
    time.className="time";

    node.appendChild(receiver);
    node.appendChild(title);
    node.appendChild(time);

    document.getElementById("sent_left").appendChild(node);
    console.log(node);
}

