import User from "../models/user.model.js";
import { generateToken } from "../lib/utils/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    
    const {fullname,email,password} = req.body;

    try {

        //Verify All Fields
        if(!fullname || !email || !password){
            return res.status(400).json({message : "All Fields are required"})
        }

        //Checking Password length is 6
        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"});
        }

        //Checking already exist user in database 

        const user = await User.findOne({email});

        if(user) return res.status(400).json({message : "Email already exists"});


        //Encrypting the password 

        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password,salt);

        //create the User using all data 

        const newUser = await User({
            fullname : fullname,
            email : email,
            password : hashPassword
        })

        if(newUser){

            //generate jwt token here
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                fullname : newUser.fullname,
                email : newUser.email,
                profilePic : newUser.profilePic,
            })


            

        }

        else{
            res.status(400).json({message : "Invalid user data"});
        }

        


        
    } catch (error) {

        console.log("Error Signup Controller",error.message);
        res.status(500).json({message : "Internal Server Error"});
        
    }


}

export const login = async (req,res)=>{
   
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "Invalid Credential"});
        }

        //Checking Password using Bcrypt Compare

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credential"});
        }

        //Correct email and passsword to generate token JWT

        generateToken(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            profilePic : user.profilePic,
        })

    } catch (error) {

        console.log("Error in Login Controller",error.message);
        res.status(400).json({message : "Internal Server Error"})
        
    }
}

export const logout = (req,res)=>{
    
    try {

        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message : "Logged out Successfully"});
        
    } catch (error) {

        console.log("Error Logout Controller",error.message);
        res.status(500).json({message : "Internal Server Error"});
        
    }
}

export const updateProfile = async (req,res)=>{

    try {

        const {profilePic} = req.body;

        //here comes from auth.middleware res.user = user

        const user = req.user._id;

        if(!profilePic){
            return res.status(400).json({message : "Profile pic is required"});
        }
        
        //upload cloudinary image and update mongodb in image url
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(user._id,{profilePic : uploadResponse.secure_url},{new:true});
        
        res.status(200).json(updatedUser);




         
        
    } catch (error) {
        
        console.log("error in update profile",error);
        res.status(500).json({message : "Internal Server error"});

    }

}

export const checkAuth = async (req,res) =>{
    

    try {
        
        res.status(200).json({user : req.user});

    } catch (error) {

        console.log("Error in CheckAuth controller",error.message);
        res.status(500).json({message : "Internal Server Error"});
        
    }

}