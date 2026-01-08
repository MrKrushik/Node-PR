const mongoose = require('mongoose');

const URI = "mongodb://localhost:27017/freedom_heroes_db";

mongoose.connect(URI).then(() => {
    console.log("Detabase is connected successfully...😊(❁´◡`❁)");
}).catch(err => {
    console.log("(👉ﾟヮﾟ)👉Database is not connected..👈(ﾟヮﾟ👈)", err);
});