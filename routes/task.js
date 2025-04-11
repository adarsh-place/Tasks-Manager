const express = require("express");
const router = express.Router();
const task = require("../controllers/task");

router.get("/",task.taskListController);

router.get("/update", task.updateController);

router.get("/add-task", task.addTaskFormController);

router.get("/update-task", task.updateTaskFormController);

router.get("/delete-task", task.deleteTaskPageController);

router.post("/add-task", task.addTaskController);

router.post("/update-task/:id", task.updateTaskController);

router.get("/confirm-delete", task.deleteTaskController);

router.get("/mark-done", task.doneTaskController);

router.use(task.pageNotFoundController);

module.exports = router;