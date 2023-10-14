const legoData = require("./modules/legoSets");
const path = require('path');
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/data/setData.json', (req, res) => {
    res.sendFile(path.join(__dirname, '/data/setData.json'));
});

app.get("/lego/sets", async (req, res) => {
    try {
        if (req.query.theme) {
            let sets = await legoData.getSetsByTheme(req.query.theme);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(JSON.stringify(sets, null, 4));  
        } else {
            let sets = await legoData.getAllSets();
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(JSON.stringify(sets, null, 4));  
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


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
