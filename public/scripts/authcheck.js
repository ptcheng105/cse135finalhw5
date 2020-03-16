const firebaseConfig = {
  apiKey: "AIzaSyB-aPdfQAyF-pXWGaNpqki834_yhxE501I",
  authDomain: "cse135winter2020.firebaseapp.com",
  databaseURL: "https://cse135winter2020.firebaseio.com",
  projectId: "cse135winter2020",
  storageBucket: "cse135winter2020.appspot.com",
  messagingSenderId: "368262465981",
  appId: "1:368262465981:web:fd5fd2e0024ece8fce6ad4"
};
let app = firebase.initializeApp(firebaseConfig);
var loginStatus;
firebase.auth().onAuthStateChanged(function (user) {
  // check if user is logged in
  var user = firebase.auth().currentUser;
  if (!user) {
    alert("Un-Authenticated Access, redirecting to Log In page");
    window.location = "https://cse135hw5timeben.firebaseapp.com/login.html"
  } else {
    //user logged in, so verify with server
    let verifyCurrentUser_xhr = new XMLHttpRequest();
    verifyCurrentUser_xhr.open("POST", "https://cse135hw5timeben.firebaseapp.com/verifyCurrentUser", true);
    verifyCurrentUser_xhr.onreadystatechange = function () {
      if (verifyCurrentUser_xhr.readyState === XMLHttpRequest.DONE && verifyCurrentUser_xhr.status === 200) {
        ret_data = JSON.parse(verifyCurrentUser_xhr.responseText);
        document.getElementById("loginStatus").innerText = `Logged In as: ${ret_data.name}, Role: ${ret_data.auth_level}`;
        loginStatus = ret_data;
      }
    };
    let payload = { name: user.displayName, email: user.email, uid: user.uid }
    verifyCurrentUser_xhr.send(JSON.stringify(payload));
  }
});