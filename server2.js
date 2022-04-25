const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
    let cert_info = req.res.socket.getPeerCertificate(false);
    console.log(cert_info);
    res.send("Hello world");
});

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "cert", "server2-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "cert", "server2-crt.pem")),
        ca: [
            fs.readFileSync(path.join(__dirname, "cert", "server-ca-crt.pem")),
        ],
        requestCert: true,
        rejectUnauthorized: true,
    },
    app
);
sslServer.listen(5001, () => {
    console.log("Secure server 2 started");
});
