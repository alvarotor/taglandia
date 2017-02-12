var db = firebase.database();
var addElement = document.getElementById("addElement");
var picture = document.getElementById("picture");
var pictureUploaded = true;
var pictureURL = "";
var format = "YYYY/MM/DD HH:mm";

picture.addEventListener("change", function (e) {
    if (!uid) {
        alert("You must be logged in.");
        return;
    };
    pictureUploaded = false;
    var errorText = "";
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref("elements/" + makeRandom() + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on("state_changed",
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("progress-bar").value = percentage;
            document.getElementById("picsMessage").textContent = "Uploading";
        },
        function error(err) {
            switch (err.code) {
                case "storage/unauthorized":
                    errorText = "User does not have permission to access " + err;
                    console.error(errorText);
                    break;
                case "storage/canceled":
                    errorText = "User canceled the upload " + err;
                    console.error(errorText);
                    break;
                case "storage/unknown":
                    // Inspect err.serverResponse
                    errorText = err;
                    console.error(err);
                    break;
            }
        },
        function complete() {
            pictureURL = uploadTask.snapshot.downloadURL;
            pictureUploaded = true;
            if (errorText.length === 0)
                document.getElementById("picsMessage").textContent = "Picture uploaded.";
            else
                document.getElementById("picsMessage").textContent = errorText;
        }
    );
});

addElement.addEventListener("click", function (e) {
    e.preventDefault();
    if (!pictureUploaded) {
        if (confirm("Uploading a pic failed, wanna upload without picture?"))
            saveElement();
    }
    else
        saveElement();
});

function saveElement() {
    if (!uid) {
        alert("You must be logged in.");
        return;
    };
    var selectizeAdd = tagboxAdd[0].selectize;
    var tags = {};
    selectizeAdd.getValue().map(function (item) {
        var tag = item.split("###");
        tags[tag[0]] = tag[1] === undefined ? "" : tag[1];
    });
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    if (name === null || description === null || name.trim() === "" || description.trim() === "") {
        alert("You cannot add an element without name or description.");
        return;
    };
    if (Object.keys(tags).length === 0) {
        alert("You cannot add an element without tags.");
        return;
    };
    var boxDate = moment(document.getElementById("expire").value, format);
    if (!boxDate.isValid()) {
        alert("The date must be valid.");
        return;
    };
    var newElementKey = db.ref().child("elements/en/").push().key;
    var newElement = {};
    newElement["elements/en/" + newElementKey] = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        expire: moment(boxDate).utc().format(format),
        tags,
        user: uid,
        pictureURL
    };
    for (tag in tags)
        newElement["tags/en/" + tag + "/elements/" + newElementKey] = document.getElementById("name").value;
    db.ref().update(newElement, cleanForm);
}

function cleanForm() {
    pictureURL = "";
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("expire").value = "";
    document.getElementById("picture").value = "";
    document.getElementById("picture").type = "";
    document.getElementById("picture").type = "file";
    var control = tagboxAdd[0].selectize;
    control.clear();
    document.getElementById("progress-bar").value = 0;
    document.getElementById("picsMessage").textContent = "Upload a picture.";
    $("#success").html("<div class='alert alert-success'>");
    $("#success > .alert-success").html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
    $("#success > .alert-success").append("<strong>Element added.</strong>");
    $("#success > .alert-success").append("</div>");
};

$("#expiredate").datetimepicker({
    format: "YYYY/MM/DD HH:mm"
});

function makeRandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}