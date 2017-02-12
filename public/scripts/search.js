var searcher = new Vue({
    el: "#search_elements",
    data: {
        elements: [],
        noElements: ""
    },
    methods: {
        search: function () {
            var that = this;
            that.elements = [];
            var results = [];
            var db = firebase.database();
            if (tagbox[0].selectize.getValue().length === 0)
                that.noElements = "Select a tag first.";
            tagbox[0].selectize.getValue().map(function (boxItem) {
                db.ref("tags/en/" + boxItem.split("###")[0] + "/elements").once("value", function (element) {
                    if (element.val() !== null)
                        Object.keys(element.val()).map(function (key) {
                            db.ref("elements/en/" + key).once("value", function (obj) {
                                var keyObj = obj.key;
                                var obj = obj.val();
                                if (!moment().utc().isBefore(moment(obj.expire, format))) {
                                    db.ref("elements/en/" + keyObj).remove();
                                    db.ref("tags/en/" + boxItem.split("###")[0] + "/elements/" + keyObj).remove();
                                }
                                else {
                                    var sTags = "";
                                    for (var prop in obj.tags)
                                        sTags += obj.tags[prop] + ", ";
                                    sTags = sTags.substring(0, sTags.length - 2);
                                    results.push({
                                        key: keyObj,
                                        name: obj.name,
                                        description: obj.description,
                                        link: getUrl() + "?key=" + keyObj + "&title=" + obj.name,
                                        sTags,
                                        expire: moment(obj.expire, format).fromNow(),
                                        pictureURL: obj.pictureURL
                                    });
                                    that.elements = _.uniqBy(results, "key");
                                    that.noElements = "";
                                    elements.search(that.elements);
                                }
                            });
                        });
                    else
                        that.noElements = "No elements found. Try add some.";
                });
            });
        }
    }
});

var elements = new Vue({
    el: "#search_element",
    data: {
        elements: []
    },
    methods: {
        search: function (elements) {
            this.elements = elements;
        }
    }
});

var single = new Vue({
    el: "#single_element",
    data: {
        element: {}
    },
    methods: {
        search: function (element, cb) {
            this.element = element;
            cb();
        }
    }
});

document.getElementById("btnSearch").addEventListener("click", function () {
    searcher.search();
});

// function checkCookie() {
//     var samples = getCookie("samples");
//     if (samples != "") {
//         alert("Welcome again " + samples);
//     } else {
//         samples = prompt("Please enter your name:", "");
//         if (samples != "" && samples != null) {
//             setCookie("samples", samples, 7);
//         }
//     }
// }
// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(";");
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == " ") {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

function getParameterByName(p, url) {
    if (!url)
        url = window.location.href;
    p = p.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + p + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

function getUrl() { return location.protocol + "//" + location.host + location.pathname; };

var key = getParameterByName("key");
var title = getParameterByName("title");

if (key !== null)
    db.ref("elements/en/" + key).once("value", function (obj) {
        if (obj.val() !== null) {
            var key = obj.key;
            var obj = obj.val();
            var sTags = "";
            for (var prop in obj.tags)
                sTags += obj.tags[prop] + ", ";
            sTags = sTags.substring(0, sTags.length - 2);
            single.search({
                key,
                name: obj.name,
                description: obj.description,
                link: getUrl() + "?key=" + key + "&title=" + obj.name,
                sTags,
                expire: moment(obj.expire, format).fromNow(),
                pictureURL: obj.pictureURL
            }, function () {
                $("#single_element").modal("show");
            });
        }
    });