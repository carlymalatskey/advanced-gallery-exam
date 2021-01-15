
const path = require('path')
const express = require("express");
const app = express(); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser");
const config = require("./config");
const cors = require("cors");
const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "c712a179-8d53-4530-8369-3d0ed23a4a48",
    subdomain: "carlymalatskey",
    tags: ["wix-flickr"],
    json: true
}));


const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/healthcheck", (_, res) => {
    res.send({"status": "alive"});
});

app.get('/name', function(req, res) {
    res.send({name: "carly"});
})

app.post('/name', function(req, res) {
    console.log("entered /name");
    let name = req.body.name;
    res.cookie('name', name);
    res.send({status: "success"});
})

app.post('/user-event', function(req, res) {
    let name = req.cookies['name'];
    let type = req.body.type;
    let message = req.body.message;

    // do something awesome with this data!`
    winston.log('info', message, {user: name, action: type});

    res.send({status: "success"});

})

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

