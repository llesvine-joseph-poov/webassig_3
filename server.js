/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Lesvine Joseph Poovakulath Student ID: 175619212 Date: 18-11-2023
*
*  Published URL: 
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require('path');
const express = require('express');
const app = express();
const authData = require("./modules/auth-service");

app.use(express.urlencoded({ extended: true }));

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

app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render('addSet', { themes });
    } catch (err) {
        res.status(500).render('500', { message: `Error: ${err.message}` });
    }
});

app.post('/lego/addSet', async (req, res) => {
    try {
        await legoData.addSet(req.body);
        res.redirect('/lego/sets');
    } catch (err) {
        res.status(500).render('500', { message: `Error: ${err.message}` });
    }
});

app.get('/lego/editSet/:num', async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.num);
        const themes = await legoData.getAllThemes();
        res.render("editSet", { set, themes });
    } catch (err) {
        res.status(404).render("404", { message: err.message });
    }
});

app.post('/lego/editSet', async (req, res) => {
    try {
        await legoData.editSet(req.body.set_num, req.body);
        res.redirect('/lego/sets');
    } catch (err) {
        res.render("500", { message: `Error: ${err.message}` });
    }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
    try {
        await legoData.deleteSet(req.params.num);
        res.redirect('/lego/sets');
    } catch (err) {
        res.render('500', { message: `Error: ${err.message}` });
    }
});


app.use((req, res) => {
    res.status(404).render("404", { message: "Sorry, the page you are looking for cannot be found." });
});

legoData.initialize()
.then(authData.initialize)
.then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.log(`Unable to start server: ${err}`);
});
