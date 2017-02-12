firebase.initializeApp({
    apiKey: "AIzaSyCYx8cc7g3gAUzpUw9SoDW_pqNnQq40vas",
    authDomain: "taglandia.firebaseapp.com",
    databaseURL: "https://taglandia.firebaseio.com",
    storageBucket: "taglandia.appspot.com",
    messagingSenderId: "974777136405"
});
var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", function (snap) {
    if (snap.val() === true)
        console.log("connected");
    else
        console.log("not connected");
});