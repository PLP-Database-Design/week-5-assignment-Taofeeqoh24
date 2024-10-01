//import our dependencies
const express = require("express");
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv');

// configure environment variable
dotenv.config();

//create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// test the connection
db.connect((err) => {
    // if the connection is not succesful
    if(err) {
        return console.log("Error connecting to the database; ", err)
    }
    // if connection is succesful
    console.log("Successfully connected to MySQL: ",db.threadId)
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// question 1 - retrieve all patients
app.get('', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients, (err, data) => {
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }
        res.status(200).render('data', { data })
    })
})

// question 2- retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers"
    db.query(getProviders, (err, providers) => {
        if(err) {
            return res.status(400).send("Failed to get providers", err)
        }
        res.status(200).render('providers', { providers })
    })
})

// question 3 - filter patients by first name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;

    if(!first_name){
        console.log("First name is required!");
        return res.status(400).send("First name is required");
    }
    const getFirstName = "SELECT * FROM patients WHERE first_name = ?";
    db.query(getFirstName, [first_name], (err, results) => {
        if(err) {
            console.log("Database query error: ", err);
            return res.status(500).send("Database query error");
        }
        if(results.length === 0) {
            console.log("No patients found with that first name");
            return res.status(404).send("No patients found with that first name");
        }
        res.json(results);
        console.log("Response sent successfully!");
    })
})

// question 4 - retrieve providers by specialty
app.get('/provider/filter', (req, res) => {
    const { provider_specialty } = req.query;
    const getProviderSpecialty = "SELECT * FROM providers WHERE provider_specialty = ?";
    if(!provider_specialty){
        console.log("Provider Specialty is required!");
        return res.status(400).send("Provider Specialty is required");
    }
    db.query(getProviderSpecialty, [provider_specialty], (err, results) => {
        if(err) {
            console.log("Database query error: ", err);
            return res.status(500).send("Database query error");
        }
        if(results.length === 0) {
            console.log("No providers found with that specialty");
            return res.status(404).send("No providers found with that specialty");
        }
        res.json(results);
        console.log("Response sent successfully!");
    })
})


//start and listen to the server
app.listen(3300, () => {
    console.log(`server is running on port 3300...`)
})