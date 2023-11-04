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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
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
        let sets;
        if (req.query.theme) {
            sets = await legoData.getSetsByTheme(req.query.theme);
        } else {
            sets = await legoData.getAllSets();
        }
        // Render the 'sets.ejs' view instead of sending JSON
        res.render("sets", { sets: sets });
    } catch (err) {
        res.status(404).render("404", { message: "The theme you are looking for does not exist in our database." });
    }
    
});



app.get("/lego/sets/:setNum", async (req, res) => {
    try {
        let legoSet = await legoData.getSetByNum(req.params.setNum);
        if (legoSet) {
            res.render("set", { set: legoSet });
        } else {
            throw new Error('Set not found.');
        }
    } catch (err) {
        res.status(404).render("404", { message: "The Lego set you are looking for cannot be found." });
    }    
});



app.use((req, res) => {
    res.status(404).render("404", { message: "Sorry, the page you are looking for cannot be found." });
});


legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
