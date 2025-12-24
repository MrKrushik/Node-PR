const express = require("express");
const fs = require('fs');
const path = require('path');

const PORT = 8780;
const app = express();

app.set('view engine', 'ejs');

console.log(__dirname);
app.use(express.static(__dirname + "/public")); // attach static files

// Middleware function
const middleware = (req, res, next) => {
    console.log("Middleware ");

    fs.appendFile('./log.txt', `\n${Date()} IP ADDRESS : ${req.ip}`, (err) => {
        if (err) {
            console.log(err);
        }
    });

    if (req.query.name === "krushik") {
        next();
    } else {
        return res.redirect('/404');
    }
}

app.get('/404', (req, res) => {
    return res.render('404.ejs');
})

app.use(middleware);

app.get('/', (req, res) => {
    return res.render('index');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server not started...😒😒", err);
        return false;
    }
    console.log("Server is successfully  Started..😁😁.");
})