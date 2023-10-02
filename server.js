/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Lesvine Joseph Poovakulath Student ID: 175619212 Date: 2023-10-01
*
*  Online (Cyclic) Link: 
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const dataService = require('./data-service.js');

const HTTP_PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // middleware as bodyParser

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get('/vehicles', (req, res) => {
    dataService.getAllVehicles()
    .then(data => {
        let tableData = `
            <table border="1" class="table table-striped">
                <thead>
                    <tr>
                        <th>VIN</th>
                        <th>Year</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Category</th>
                        <th>Color</th>
                        <th>Navigation</th>
                        <th>Fuel Economy (City)</th>
                        <th>Fuel Economy (Highway)</th>
                        <th>Price</th>
                        <th>Horsepower</th>
                        <th>Drivetrain</th>
                        <th>Powertrain</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>`;
        
        data.forEach(vehicle => {
            tableData += `
                <tr>
                    <td>${vehicle.VIN}</td>
                    <td>${vehicle.year}</td>
                    <td>${vehicle.make}</td>
                    <td>${vehicle.model}</td>
                    <td>${vehicle.category}</td>
                    <td>${vehicle.color}</td>
                    <td>${vehicle.navigation ? 'Yes' : 'No'}</td>
                    <td>${vehicle.fuelEconomyCity}</td>
                    <td>${vehicle.fuelEconomyHighway}</td>
                    <td>${vehicle.price}</td>
                    <td>${vehicle.horsepower}</td>
                    <td>${vehicle.drivetrain}</td>
                    <td>${vehicle.powertrain}</td>
                    <td>${vehicle.registrationDate}</td>
                </tr>`;
        });
        
        tableData += `</tbody></table>`;
        res.send(tableData);
    })
        .catch(err => res.json({message: err}));
});

app.get('/vehicles2023', (req, res) => {
    dataService.get2023Vehicles()
    .then(data => {
        let tableData = `
            <table border="1" class="table table-striped">
                <thead>
                    <tr>
                        <th>VIN</th>
                        <th>Year</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Category</th>
                        <th>Color</th>
                        <th>Navigation</th>
                        <th>Fuel Economy (City)</th>
                        <th>Fuel Economy (Highway)</th>
                        <th>Price</th>
                        <th>Horsepower</th>
                        <th>Drivetrain</th>
                        <th>Powertrain</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>`;
        
        data.forEach(vehicle => {
            tableData += `
                <tr>
                    <td>${vehicle.VIN}</td>
                    <td>${vehicle.year}</td>
                    <td>${vehicle.make}</td>
                    <td>${vehicle.model}</td>
                    <td>${vehicle.category}</td>
                    <td>${vehicle.color}</td>
                    <td>${vehicle.navigation ? 'Yes' : 'No'}</td>
                    <td>${vehicle.fuelEconomyCity}</td>
                    <td>${vehicle.fuelEconomyHighway}</td>
                    <td>${vehicle.price}</td>
                    <td>${vehicle.horsepower}</td>
                    <td>${vehicle.drivetrain}</td>
                    <td>${vehicle.powertrain}</td>
                    <td>${vehicle.registrationDate}</td>
                </tr>`;
        });
        
        tableData += `</tbody></table>`;
        res.send(tableData);
    })
        .catch(err => res.json({message: err}));
});

app.get('/brands', (req, res) => {
    dataService.getBrands()
    .then(data => {
        let tableData = `
            <table border="1" class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody>`;
        
        data.forEach(brand => {
            tableData += `
                <tr>
                    <td>${brand.id}</td>
                    <td>${brand.brand}</td>
                    <td>${brand.manufacturer}</td>
                </tr>`;
        });
        
        tableData += `</tbody></table>`;
        res.send(tableData);
    })
        .catch(err => res.json({message: err}));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/newmember", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/newMember.html"));
});

app.post("/newmember", (req, res) => {
    const formData = req.body;
    dataService.addNewMember(formData)
        .then(() => res.redirect("/members"))
        .catch(err => res.send(err));
});

app.get("/members", (req, res) => {
    dataService.getAllMembers()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get("/members/:id", (req, res) => {
    dataService.getMembersById(req.params.id)
        .then(data => {
            res.send(`
                <h2>Member data</h2>
                <ul>
                    <li>name: ${data.name}</li>
                    <li>age:  ${data.age}</li>
                    <li>photo: <img src="${data.photoUrl}" alt="${data.name}" height="75"></li>
                    <li>occupation: ${data.occupation}</li>
                    <li>company: ${data.company}</li>
                </ul>
            `);
        })
        .catch(err => res.send(err));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// TODO: Add your update and delete routes here.

// Catch-all for non-matching routes:
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

dataService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(err => {
        console.error("Error initializing data: ", err);
    });
