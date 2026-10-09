// DEPENDENCIES
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is required'],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        match:[/.+@.+\..+/, "Must match an email address!"]
    },
    password:{
        type:String,
        required: [true, "Password is required..."],
        minlength: [8, "Password must be at least 8 characters long..."],
        trim:true
    }
}, {
    timestamps: true
});
// Pre-save hook to hash the password using bcrypt
userSchema.pre("save", async function(){
    if(this.isNew || this.isModified("password")){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
});

userSchema.methods.isCorrectPassword = function(password){
    return bcrypt.compare(password, this.password);
}

// Create a User model for the above schema
const User = new mongoose.model("User", userSchema);
module.exports = User;