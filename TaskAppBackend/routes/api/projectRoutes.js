const express = require('express');
const router = express.Router();
const authController = require('../../controller/projectController');
const verifyToken = require('../../verifyAuthentication');
const taskController = require('../../controller/tasksController')

router.use(verifyToken);
router.post('/', authController.createProject);
router.get('/', authController.getProjects);
router.get('/:id', authController.getProjectById);
router.put('/:id', authController.updateProject);
router.delete('/:id', authController.deleteProject);
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks', taskController.getTasks);

module.exports = router;