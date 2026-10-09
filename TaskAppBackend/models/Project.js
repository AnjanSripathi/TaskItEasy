const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please mention Project's title"]
    },
    description: {
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Project = new mongoose.model("Project", projectSchema);
module.exports = Project;
