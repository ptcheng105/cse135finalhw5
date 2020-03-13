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
const btn_login = document.getElementById("btn_login");
btn_login.addEventListener("click", ()=>{
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        window.location = "https://cse135timbenfinalproject.firebaseapp.com/dashboard.html"
    }).catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Failed log in: " + errorCode +", "+ errorMessage)
    })
})