const express = require('express');
const port = 8780;
const app = express();

let allDatatask = [];

let id = 1;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.render('view', {
        allDatatask,
    });
});

app.get('/addDataPage', (req, res) => {
    res.render('add');
});

app.post('/addData', (req, res) => {
    const task = req.body;

    task.Id = id;
    id++;

    allDatatask.push(task);
    res.redirect('/');
});

app.get('/removeTask', (req, res) => {
    console.log(req.query);

    const Userid = req.query.Id;

    allDatatask = allDatatask.filter((task) => task.Id != Userid);

    res.redirect('/');
});

app.get("/edittask", (req, res) => {
    console.log(req.query);
    const task = allDatatask.find((task) => task.Id == req.query.Id);
    if (!task) {
        return res.redirect('/');
    }
    return res.render('edit', {
        task
    });
});

app.post('/edittask', (req, res) => {
    console.log(req.body);
    allDatatask = allDatatask.map((task) => {
        if (task.Id == req.body.Id) {
            return req.body;
        }
        else {
            return task;
        }
    })
    return res.redirect('/');
});

app.listen(port, (err) => {
    if (err) {
        console.log("Server Not started....... it is Found!!!", err);
        return false;
    }
    console.log("Server IS started");
});