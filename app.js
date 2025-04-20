let express = require("express");
let app = express();

const mongoose = require("mongoose");
const Doctor = require("./models/doctors.js");

let path = require("path");

let engine = require("ejs-mate");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.engine("ejs", engine);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));





//app urls

let port = 8080;

app.listen(port, () => {
    console.log(`server is listing to port ${port}`);
});

app.get("/", async (req, res) => {
    const allDoctors = await Doctor.find({});
    res.render("home.ejs", {allDoctors});
});

app.get("/appointment", async (req, res) => {
    const allDoctors = await Doctor.find({});
    res.render("appointment/appointment.ejs", {allDoctors});
});

app.get("/appointment/:id",async (req, res) => {
    let {id} = req.params;
    const doctor = await Doctor.findById(id);
    res.render("appointment/doctor.ejs",{doctor});
});