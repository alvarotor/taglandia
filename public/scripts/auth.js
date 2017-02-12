var uid = null;

function toggleGoogleSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope("https://www.googleapis.com/auth/plus.login");
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // [START_EXCLUDE]
            // document.getElementById("oauthtoken").textContent = token;
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // [START_EXCLUDE]
            if (errorCode === "auth/account-exists-with-different-credential") {
                alert("You have already signed up with a different auth provider for that email.");
                // If you are using multiple auth providers on your app you should handle linking
                // the user's accounts here.
            } else
                console.error(error);
            // [END_EXCLUDE]
        });
        // [END signin]
    } else
        firebase.auth().signOut();
}

function toggleFacebookSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.FacebookAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope("user_birthday");
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // [START_EXCLUDE]
            // document.getElementById("oauthtoken").textContent = token;
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // [START_EXCLUDE]
            if (errorCode === "auth/account-exists-with-different-credential") {
                alert("You have already signed up with a different auth provider for that email.");
                // If you are using multiple auth providers on your app you should handle linking
                // the user"s accounts here.
            } else
                console.error(error);
            // [END_EXCLUDE]
        });
        // [END signin]
    } else
        firebase.auth().signOut();
}

function toggleSignIn() {
    if (firebase.auth().currentUser)
        firebase.auth().signOut();
    else {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        if (email.length < 4) {
            alert("Please enter an email address.");
            return;
        }
        if (password.length < 4) {
            alert("Please enter a password.");
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === "auth/wrong-password")
                alert("Wrong password.");
            else
                alert(errorMessage);
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
}

function handleSignUp() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (email.length < 4) {
        alert("Please enter an email address.");
        return;
    }
    if (password.length < 4) {
        alert("Please enter a password.");
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == "auth/weak-password")
            alert("The password is too weak.");
        else
            alert(errorMessage);
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert("Email Verification Sent!");
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById("email").value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert("Password Reset Email Sent!");
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == "auth/invalid-email")
            alert(errorMessage);
        else if (errorCode == "auth/user-not-found")
            alert(errorMessage);
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

$(".auth-modal").on("shown.bs.modal", function () {
    $("#email").focus()
});
function initAuth() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]
        if (document.getElementById("verify-email") !== null)
            document.getElementById("verify-email").disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            uid = user.uid;
            // console.log(uid)
            var providerData = user.providerData;
            // [START_EXCLUDE silent]
            document.getElementById("log-in-status").textContent = "You are logged in";
            if (document.getElementById("log-in") !== null) {
                document.getElementById("log-in").textContent = "Log out";
                // document.getElementById("account-details").textContent = JSON.stringify(user, null, "  ");
                document.getElementById("email").style.display = "none";
                document.getElementById("password").style.display = "none";
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                document.getElementById("sign-up").disabled = true;
                document.getElementById("facebook-sign-in").disabled = true;
                document.getElementById("google-sign-in").disabled = true;
            }
            if (!user.emailVerified)
                if (document.getElementById("verify-email") !== null)
                    document.getElementById("verify-email").disabled = false;
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE silent]
            uid = null;
            if (document.getElementById("addLoginMessage") !== null) {
                document.getElementById("addElement").disabled = true;
                document.getElementById("addLoginMessage").textContent = "You cant add anything as you are not logged in. Do it on the home page.";
            }
            document.getElementById("log-in-status").textContent = "You are logged out";
            if (document.getElementById("log-in") !== null) {
                document.getElementById("log-in").textContent = "Log in";
                // document.getElementById("account-details").textContent = "null";
                document.getElementById("email").style.display = "block";
                document.getElementById("password").style.display = "block";
                document.getElementById("sign-up").disabled = false;
                document.getElementById("facebook-sign-in").disabled = false;
                document.getElementById("google-sign-in").disabled = false;
            }
            // [END_EXCLUDE]
        }
    });
    // [END authstatelistener]

    if (document.getElementById("log-in") !== null) {
        document.getElementById("log-in").addEventListener("click", toggleSignIn, false);
        document.getElementById("sign-up").addEventListener("click", handleSignUp, false);
        document.getElementById("facebook-sign-in").addEventListener("click", toggleFacebookSignIn, false);
        document.getElementById("google-sign-in").addEventListener("click", toggleGoogleSignIn, false);
        document.getElementById("verify-email").addEventListener("click", sendEmailVerification, false);
        document.getElementById("password-reset").addEventListener("click", sendPasswordReset, false);
    }
}

window.onload = function () {
    initAuth();
};
