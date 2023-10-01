//// data-service.js: "model" out of MVC
let members = [];
const fs = require('fs');

let vehicles = [];
let brands = [];



module.exports.getAllVehicles = function() {
    return new Promise((resolve, reject) => {
        if (vehicles.length === 0) {
            return reject('no results returned');
        }
        resolve(vehicles);
    });
};

module.exports.get2023Vehicles = function() {
    return new Promise((resolve, reject) => {
        const vehicles2023 = vehicles.filter(vehicle => vehicle.year === 2023);
        if (vehicles2023.length === 0) {
            return reject('no results returned');
        }
        resolve(vehicles2023);
    });
};

module.exports.getBrands = function() {
    return new Promise((resolve, reject) => {
        if (brands.length === 0) {
            return reject('no results returned');
        }
        resolve(brands);
    });
};

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/vehicles.json', 'utf8', (err, data) => {
            if (err) {
                return reject('unable to read vehicles file');
            }
            vehicles = JSON.parse(data);

            fs.readFile('./data/brands.json', 'utf8', (err, data) => {
                if (err) {
                    return reject('unable to read brands file');
                }
                brands = JSON.parse(data);

                members = [
                    {
                        name: "John Smith",
                        age: 23,
                        photoUrl: "https://reqres.in/img/faces/8-image.jpg",
                        occupation: "student",
                        company: "Seneca College",
                        visible: true
                    },
                    {
                        name: "Steve Wong",
                        age: 32,
                        photoUrl: "http://localhost:8080/images/Express.js.png",
                        occupation: "developer",
                        company: "Newnham Inc."
                    },
                    {
                        name: "Sarah",
                        age: 32,
                        photoUrl: "http://localhost:8080/images/ca.png",
                        occupation: "manager",
                        company: "Seneca@York"
                    }
                ];
                resolve();
            });
        });
    });
};




// CRUD operations for the Member Entity:

// C - Create
module.exports.addNewMember = function(data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject('Invalid data provided');
        }
        members.unshift(data);
        resolve();
    })
}

// R - Retrieve: GetAll
module.exports.getAllMembers = function(){
    return new Promise((resolve,reject)=>{
        if (members.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(members);
    })
}

// R - Retrieve: GetOne
module.exports.getMembersById = function(id){ // user element position in the array to mimic id
    return new Promise((resolve,reject)=>{
        if (id <= members.length) {
            resolve( members[id-1] );
        } else {
            reject("The given id is out of range"); 
        }
    })
}

// U - Update
module.exports.updateMember = function(data, id){
    if (id <= members.length){
        members[id-1] = data;
    }
}

// D - Delete
module.exports.deleteMemberById = function(id){
    if (id <= members.length) {
        members.splice(id-1, 1); 
    }
}


// CRUD operations for other Entities in the web app:
// ...