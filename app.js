var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

app.use(express.static(path.join(__dirname, "public")));

var server = http.createServer(app);
var io = require("socket.io").listen(server);

//Index
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/html/index.html");
});

//Media Library Events
app.post("/medialibrary/newimageready", function (req, res) {
    var clientId = req.body.clientId;
    if (!clientId) {
        res.send(false);
        return;
    }

    console.log("New Image has been processed and is ready for presentation(client " + clientId + ")");
    mediaLibraryNsp.to(clientId).emit("new image ready", req.body);

    res.send(true);
});

//Socket IO
var mediaLibraryNsp = io.of("/medialibrary");

mediaLibraryNsp.on("connection", function (socket) {
    socket.on("disconnect", function () {
    });

    socket.on("join room", function (clientId) {
        socket.join(clientId);
    });

    socket.on("asset uploaded", function (data) {
        var clientId = data.clientId;
        var assetName = data.assetName;
        console.log(`Asset: ${assetName} for client: ${clientId} has been uploaded`);

        // mediaLibraryNsp.to(clientId).emit("asset uploaded", assetName); //To everyone
        socket.to(clientId).emit("asset uploaded", assetName); //To everyone except sender
    });
});

server.listen(port, function () {
    console.log("Listening on port " + port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}