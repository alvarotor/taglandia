var render = {
    item: function (data, escape) {
        return "<div>" + _.capitalize(escape(data.text)) + "</div>";
    }
};

var load = function (query, callback) {
    $.get("https://taglandia.firebaseio.com/tags.json", function (data) {
        if (data !== null)
            callback(Object.keys(data.en).map(function (e) {
                var name = _.capitalize(escape(data.en[e].name))
                return { value: `${e}###${name}`, text: `${name}` }
            }));
    });
};

var tagboxConf = {
    persist: true,
    preload: true,
    openOnFocus: true,
    sortField: "name",
    render: render,
    load: load
};

var tagboxConfAdd = {
    plugins: ["remove_button", "restore_on_backspace"],
    create: true,
    persist: true,
    preload: true,
    openOnFocus: true,
    delimiter: " ",
    sortField: "name",
    render: render,
    create: function (input, callback) {
        var options = tagbox[0].selectize.options;
        var found = false;
        Object.keys(options).map(function (item) {
            if (options[item].text === input && !found) {
                alert("Tag already exists");
                found = true;
            };
        });
        if (found) callback();
        else {
            if (!uid) {
                alert("You must be logged in to add new tags.");
                callback();
            }
            else {
                var selectize = tagbox[0].selectize;
                selectize.addOption({ value: newTagKey, text: input });
                selectize.refreshOptions();

                var newTagKey = firebase.database().ref().child("tags/en/").push().key;
                var newTag = {};
                newTag["tags/en/" + newTagKey] = { name: input };
                newTag["tagsList/en/" + input.toLowerCase()] = true;
                firebase.database().ref().update(newTag, callback({ value: newTagKey, text: input }));
            };
        };
    },
    load: load
};

var tagbox = $("#tagBox").selectize(tagboxConf);
var tagboxAdd = $("#tagBoxAdd").selectize(tagboxConfAdd);

$(".sampleBox").selectize({
    render: render
});