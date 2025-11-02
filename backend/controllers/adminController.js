import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'


// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address, imageURL} = req.body
        const imageFile = req.file
        console.log({name, email, password, speciality, degree, experience, about, fees, address},req.file)

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            res.json({success:false, message:"Missing Details"})
        }

        if(!validator.isEmail(email)){
            res.json({success:false, message:"Please enter a valid email"})
        }

        if(password.length < 8){
            res.json({success:false, message:"Please enter a strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(9)
        const hashedPassword = await bcrypt.hash(password, salt)

        console.log("working 1")

        // //upload image to cloudinary
        // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image', folder: 'doctor_sahab'})
        // console.log("working 2")
        // const imageURL = imageUpload.secure_url

        console.log("working 3", imageURL)

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageURL,
            speciality,
            degree,
            about,
            address: JSON.parse(address),
            experience,
            fees,
            date: Date.now()
        }

        console.log("working 4")
        const newDoctor = new doctorModel(doctorData)
        
        console.log("working 5")
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:"error in adding doctor"})
    }
}

export {addDoctor}