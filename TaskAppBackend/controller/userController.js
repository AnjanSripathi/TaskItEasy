const User = require('../models/User');
const jwt = require('jsonwebtoken');
const register = async(req,res)=>{
    try{
        const foundUser = await User.findOne({email: req.body.email});
        if(foundUser !== null){
            return res.status(400).json({message:"This user already exists"});
        }
        const newUser = await User.create(req.body);
        const payload = {_id: newUser._id, username: newUser.username, email: newUser.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(201).json({message:"User created successfully",token,payload});
    }
    catch(error){
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

const login = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(400).json({message: "Incorrect email or password"});
        }
        const correctPass = await user.isCorrectPassword(req.body.password);
        if(!correctPass){
            return res.status(400).json({message:"Incorrect email or password"});
        }
        const payload = {_id : user._id, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).json({message: "User logged in successfully",token,payload});
    }
    catch(error){
        console.error(error);
        res.status(400).json({message:error.message});
    }
}
module.exports = { register, login };