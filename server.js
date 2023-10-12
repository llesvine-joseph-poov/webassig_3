const legoData = require("./modules/legoSets");
const path = require('path');
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Static public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get("/lego/sets", async (req, res) => {
    try {
        if (req.query.theme) {
            let sets = await legoData.getSetsByTheme(req.query.theme);
            res.send(sets);
        } else {
            let sets = await legoData.getAllSets();
            res.send(sets);
        }
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get("/lego/sets/:setNum", async (req, res) => {
    try {
        let set = await legoData.getSetByNum(req.params.setNum);
        if (set) {
            res.send(set);
        } else {
            throw new Error('Set not found.');
        }
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// 404 handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
