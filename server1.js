const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const app = express();
const axios = require("axios");

async function callit() {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: true,
        cert: fs.readFileSync(path.join(__dirname, "cert", "server-crt.pem")),
        key: fs.readFileSync(path.join(__dirname, "cert", "server-key.pem")),
        ca: fs.readFileSync(path.join(__dirname, "cert", "server2-ca-crt.pem")),
    });
    try {
        let data = await axios.get("https://localhost:5001/", { httpsAgent });
        let received_msg = data.data;
        let cert_info = data.request.res.socket.getPeerCertificate(false);

        console.log({
            message: received_msg,
            certificate: cert_info,
        });
    } catch (e) {
        console.log(e);
    }
}

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "cert", "server-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "cert", "server-crt.pem")),
        ca: [
            fs.readFileSync(path.join(__dirname, "cert", "server2-ca-crt.pem")),
        ],
        requestCert: true,
        rejectUnauthorized: true,
    },
    app
);
sslServer.listen(5000, () => {
    callit();

    console.log("Secure server 1 started");
});
