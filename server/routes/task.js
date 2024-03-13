const express = require("express");
const router = express.Router();
const { addTask, allTasks, deleteTask, markComplete, searchQuery } = require('../controller/task');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/addtask', verifyToken, addTask);

router.get('/alltask', verifyToken, allTasks);

router.delete('/deletetask', verifyToken, deleteTask);

router.post('/markcomplete', verifyToken, markComplete);

router.get('/search/:userId/:key',verifyToken,searchQuery);

module.exports = router;