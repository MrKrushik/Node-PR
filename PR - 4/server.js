require('./config/db.config'); // Database connection
const express = require('express');
const antiqueModel = require("./model/antique.model"); // Antique model
const fs = require('fs');
const path = require('path');

const PORT = 8780;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

console.log(__dirname);
app.use(express.static(path.join(__dirname, "style")));

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Custom Middleware
const middleware = (req, res, next) => {
    console.log("Query name:", req.query.name);

    fs.appendFile('./log.txt', `\n${Date()} IP ADDRESS : ${req.ip}`, (err) => {
        if (err) {
            console.log(err);
        }
    });

    if (req.query.name === "krushik") {
        next();
    } else {
        console.log("Middleware failed, redirecting to 404");
        return res.redirect('/404');
    }
}

// 404 page
app.get('/404', (req, res) => {
    console.log("Rendering 404 page");
    return res.render('404');
});

// HOME PAGE 
app.get('/', middleware, async (req, res) => {
    console.log("Home route - fetching antiques");
    const totalantiques = await antiqueModel.find();
    return res.render('index', { totalantiques });
});

// add page
app.get('/addantiquePage', (req, res) => {
    console.log("Rendering add page");
    return res.render('addpage');
});


app.post('/addantique', async (req, res) => {
    console.log("Adding antique:", req.body);
    
    const antiqueAdded = await antiqueModel.create(req.body);
    console.log("Antique added successfully:", antiqueAdded);

   
    return res.redirect('/?name=krushik');
});

// edit page 
app.get('/editantique/:antiqueId', async (req, res) => {
    console.log("Edit route - ID:", req.params.antiqueId);
    const foundAntique = await antiqueModel.findById(req.params.antiqueId);
    console.log("Found antique:", foundAntique);

    if (foundAntique) {
        return res.render('editpage', { antique: foundAntique });
    } else {
        console.log("Antique not found");
        return res.redirect('/?name=krushik');
    }
});

// update antique item
app.post('/updateantique', async (req, res) => {
    console.log("Updating antique:", req.body);
    
    const updatedData = await antiqueModel.findByIdAndUpdate(
        req.body.id,
        req.body,
        { new: true }
    );
    console.log("Antique updated successfully:", updatedData);

   
    return res.redirect('/?name=krushik');
});

// delete antique item
app.get('/deleteantique', async (req, res) => {
    console.log("Delete route - ID:", req.query.antiqueId);
    
    const deletedAntique = await antiqueModel.findByIdAndDelete(req.query.antiqueId);

    if (deletedAntique) {
        console.log("Antique deleted successfully! 😊");
    } else {
        console.log("Antique not found for deletion");
    }


    return res.redirect('/?name=krushik');
});


app.use((req, res) => {
    console.log("404 Catch-all triggered for:", req.path);
    return res.status(404).render('404');
});

// Server Listening
app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not started...sorry...is failed....", err);
        return;
    }
    console.log("Server Is Started  (●'◡'●)  Maja Aa Gaya Bro.. 😂");
});