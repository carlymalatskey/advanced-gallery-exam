
const path = require('path')
const express = require("express");
const app = express(); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser");
const config = require("./config");
const cors = require("cors");

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/healthcheck", (_, res) => {
    res.send({"status": "alive"});
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'build/index.html'), function(err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

