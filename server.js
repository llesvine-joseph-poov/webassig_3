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
const authData = require("./modules/auth-service");
const clientSessions = require('client-sessions');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
const HTTP_PORT = process.env.PORT || 8080;
// Session configuration
app.use(clientSessions({
    cookieName: "session", // This is the name of the req.session object
    secret: "Your_Secret_String", // This should be a long random string
    duration: 2 * 60 * 1000, // Duration of the session in milliseconds (2 hours)
    activeDuration: 60 * 1000 // The session will be extended by this many ms each request (10 minutes)
  }));
  
  // Middleware to make the session available to all views
  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Helper middleware for login check
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }

// GET route for login page
app.get('/login', (req, res) => {
    const errorMessage = req.session.errorMessage;

    res.render('login',{errorMessage}); // Assuming you have a 'login.ejs' view
});

// GET route for registration page
app.get('/register', (req, res) => {
    let errorMessage = null;
    let successMessage = null;
    res.render('register',{errorMessage,successMessage}); // Assuming you have a 'register.ejs' view
});

// POST route for user registration
app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => res.render('register', { successMessage: 'User created' }))
        .catch(err => res.render('register', { errorMessage: err, userName: req.body.userName }));
});
/*app.get("/register", function(req, res) { 
    res.render('register');
  });
  
  app.post("/register", function(req, res) {
    authData.registerUser(req.body)
    .then(() => {
        res.render('register', { successMessage: "User created!"})
    })
    .catch((err) => {
        res.render('register', { errorMessag: err, userName: req.body.userName })
    });
  });*/

// POST route for user login
app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    authData.checkUser(req.body)
        .then(user => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/lego/sets');
        })
        .catch(err => res.render('login', { errorMessage: err, userName: req.body.userName }));
});

// GET route for logout
app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

// GET route for user history (Protected route)
app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory'); // Assuming you have a 'userHistory.ejs' view
});

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
