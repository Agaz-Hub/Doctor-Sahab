const mongoose = require("mongoose");
const initData = require("./data.js");
const Doctor = require("../models/doctors.js");

let MONGO_URL = 'mongodb://127.0.0.1:27017/doctorSahabDB';

main().then( () => {
    console.log('server is connected');
}).catch( (err) => {
    console.log(err);
})


async function main(){
    await mongoose.connect(MONGO_URL);
}

let data = initData.data;

const initDB = async () => {
    await Doctor.deleteMany({});
    await Doctor.insertMany(data);
    console.log("DB was initialized");
}

initDB();