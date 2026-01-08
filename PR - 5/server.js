const express = require('express');
require('./config/db.config');
const path = require('path');

const app = express();
const PORT = 8780;

app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const heroRoutes = require("./routes/hero.route");
app.use("/hero", heroRoutes);

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is failed... Not started...😭😭", err);
        return;
    }

    console.log("Server is started successfully...😊😊 Bahut Badhiya...");
});