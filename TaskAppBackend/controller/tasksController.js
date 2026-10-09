const Task = require('../models/Task');
const Project = require('../models/Project');

// Create a task
const createTask = async(req,res)=>{
    try{
        const project = await Project.findOne({
            _id: req.params.projectId,
            user: req.user._id
        });
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        const task = await Task.create({...req.body, project: project._id});
        res.status(201).json(task);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get a list of tasks for a specific project
const getTasks = async(req,res)=>{
    try{
        const project = await Project.findOne({
            _id: req.params.projectId,
            user: req.user._id
        });
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        const tasks = await Task.find({ project: project._id });
        res.status(200).json(tasks);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Updates a single task
const updateTask = async(req,res)=>{
    try{
        const task = await Task.findOne({_id: req.params.taskId});
        if(!task){
            return res.status(404).json({ error: 'Task not found' });
        }
        const ownsProject = await Project.exists({
            _id: task.project,
            user: req.user._id
        });

        if (!ownsProject) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
        res.status(200).json(updatedTask);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Deletes a single task
const deleteTask = async(req,res)=>{
    try{
        const task = await Task.findOne({_id: req.params.taskId});
        if(!task){
            return res.status(404).json({ error: 'Task not found' });
        }
        const ownsProject = await Project.exists({
            _id: task.project,
            user: req.user._id
        });

        if (!ownsProject) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}
module.exports = { createTask, getTasks, updateTask, deleteTask };