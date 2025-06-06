let express = require("express");
let app = express();

const mongoose = require("mongoose");
const Doctor = require("./models/doctors.js");
const Appointment = require("./models/appointment.js");

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

app.post("/appointment", async (req, res) =>{
    const newAppointment = new Appointment(req.body.appointment);
    await newAppointment.save();
    res.redirect("/");
});


app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    try {
      const doctors = await Doctor.find({ name: { $regex: query, $options: 'i' } })
        .limit(5) // limit suggestions to 5
        .exec();
      res.json(doctors);
    } catch (err) {
      res.status(500).send('Error fetching doctors');
    }
  });
  