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

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number, // years of experience
    default: 0
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableDays: {
    type: [String], // e.g. ['Monday', 'Wednesday', 'Friday']
    default: []
  },
  availableTime: {
    start: String, // e.g. '10:00 AM'
    end: String    // e.g. '4:00 PM'
  },
  address: {
    clinicName: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isOnlineConsultant: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String, // URL to the image or filename if you're storing locally
    default: ''   // Optional: you can set a default profile image URL
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
