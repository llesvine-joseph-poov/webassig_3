/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Lesvine Joseph Poovakulath Student ID: 175619212 Date: 03-11-2023
*
*  Published URL: 
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require('path');
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
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
    res.status(404).render("404");
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
