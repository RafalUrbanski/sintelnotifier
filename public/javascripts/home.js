var socket = io("/medialibrary");

socket.on("connect", function () {
    var clientId = getParameterByName("clientId") || "default";
    socket.emit("join room", clientId);
});

var uploadNewImage = function () {
    $.ajax({
        type: "POST",
        url: "http://desktop-4kgpbfh:3000/medialibrary/newimageready",
        data: { clientId: getParameterByName("clientId") || "default" }
    });
    // socket.emit("image uploaded", { clientId: getParameterByName("clientId") || "default" });
};

socket.on("new image", function (assetComposite) {
    console.log("New image is ready (client " + assetComposite.clientId + ")");
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}