//import the module via common js
const express = require('express');
//import body parser to parse the data being sent to server
const bodyParser = require('body-parser');
// import cors to stop access error
const cors = require('cors');
// import knex library to connect to database
const knex = require('knex');
// import bcrypt to secure password by adding saltRound to your hashes
const bcrypt = require("bcrypt-nodejs");

//dependency injection
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile")
const image = require("./controllers/image")

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    }
});


// checking if all data is there
// db.select('*').from('users').then(data => {
//     console.log(data);
// });


//run express
const app = express();
// run bodyparser
app.use(bodyParser.json());
//run cors to connect backend to front-end
app.use(cors());

//don't really need this
app.get('/', (req, res) => {
    res.send('working!');
})


// /signIn --> POST = success/fail (over https with psw to be secure i.e. POST)
app.post('/signin', (req, res) =>  {
    signin.handleSignin(req, res, db, bcrypt)
})

// /register --> POST = create user object
app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
})

// /profile/:userid  i.e home screen --> GET = user information from server
app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
})

// /image --> PUT  = update the count of submits and show Rank
app.put('/image', (req, res) => {
    image.handleImage(req, res, db)
})

// /image --> PUT  = update the count of submits and show Rank
app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res)
})

//run on port
app.listen(process.env.PORT  || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}!`)
})
