const firebaseConfig = {
    apiKey: "AIzaSyB-aPdfQAyF-pXWGaNpqki834_yhxE501I",
    authDomain: "cse135winter2020.firebaseapp.com",
    databaseURL: "https://cse135winter2020.firebaseio.com",
    projectId: "cse135winter2020",
    storageBucket: "cse135winter2020.appspot.com",
    messagingSenderId: "368262465981",
    appId: "1:368262465981:web:01cef2e366a7b071ce6ad4"
  };
firebase.initializeApp(firebaseConfig);
  
var db = firebase.firestore();

addNewUser("tim", 1)

function addNewUser(name,id){
    db.collection("users").add({
        name: name,
        id: id
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}