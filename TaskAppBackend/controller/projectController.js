const Project = require('../models/Project');
const Task = require('../models/Task');
const express = require('express');

// const verifyToken = require('../verifyAuthentication');

// Apply authMiddleware to all routes in this file (This should always be done on the route level, not here )
// router.use(verifyToken);
//Create a new project
const createProject = async(req,res)=>{
    try{
        const project = await Project.create({...req.body, user: req.user._id});
        res.status(201).json(project);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get all projects for the authenticated user
const getProjects = async(req,res) =>{
    try{
        const projects = await Project.find({user: req.user._id});
        res.status(200).json(projects);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get a project by its ID for the authenticated user
const getProjectById = async(req,res)=>{
    try{
        const project = await Project.findOne({_id: req.params.id, user: req.user._id});
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// 
const updateProject = async(req,res)=>{
    try{
        const project = await Project.findOneAndUpdate({_id: req.params.id, user: req.user._id}, 
            { $set: req.body},
            { new: true, runValidators: true });
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

const deleteProject = async(req,res)=>{
    try{
        const project = await Project.findOneAndDelete({_id: req.params.id, user: req.user._id});
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        await Task.deleteMany({ project: project._id });
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
}