const express = require('express');
const router = express.Router();
const Tasks = require('../../controller/tasksController');
const verifyToken = require('../../verifyAuthentication');

router.use(verifyToken);

// router.get('/:id', Tasks.getTaskById);
router.put('/:taskId', Tasks.updateTask);
router.delete('/:taskId', Tasks.deleteTask);

module.exports = router;