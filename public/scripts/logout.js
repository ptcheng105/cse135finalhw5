const btn_logout = document.getElementById("btn_logout");
btn_logout.addEventListener("click", ()=>{
    firebase.auth().signOut().then(function() {
        alert("sign out successful");
        window.location = "https://cse135hw5timeben.firebaseapp.com/login.html";
      }).catch(function(error) {
        alert("Error signing out, please retry");
      });
})