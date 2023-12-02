require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [{ dateTime: Date, userAgent: String }]
});

let User;

function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection('mongodb+srv://llesvinejosephpoov:JxzzYv9EImesMfGS@cluster0.avvgqxq.mongodb.net/?retryWrites=true&w=majority');

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
}

function registerUser(userData) {
    return new Promise(function (resolve, reject) { 
        if (userData.password == userData.password2) {
            bcrypt.hash(userData.password, 10, function(err, hash) {
                if (err) {
                    reject("There was an error encrypting the password");
                }
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save() 
                .then(() => resolve())
                .catch((err) => reject("There was an error creating the user: " + err));
            })
            } else {
            reject("Passwords do not match");
        }
    });
};

function checkUser(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ userName: userData.userName });

            if (!user) {
                reject(`Unable to find user: ${userData.userName}`);
            } else {
                const passwordMatch = await bcrypt.compare(userData.password, user.password);

                if (!passwordMatch) {
                    reject(`Incorrect Password for user: ${userData.userName}`);
                } else {
                    user.loginHistory.unshift({ dateTime: new Date().toString(), userAgent: userData.userAgent });
                    if (user.loginHistory.length > 8) user.loginHistory.pop();

                    await User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } });

                    resolve(user);
                }
            }
        } catch (err) {
            reject(`There was an error verifying the user: ${err}`);
        }
    });
}

module.exports = { initialize, registerUser, checkUser };


