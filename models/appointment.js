let mongoose = require("mongoose");

let MONGO_URL = 'mongodb://127.0.0.1:27017/doctorSahabDB';

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then( () => {
    console.log("server is connected");
}).catch( (err) => {
    console.log(err);
});

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  symptoms: String,
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  address: String,
  mode: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);