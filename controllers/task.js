const moment = require("moment");
const Task = require("../models/Task");

const taskListController = async(req, res, next) => {
  try {
    const tasks = await Task.find({}).sort({ deadlineDateTime : 1});

    const currDate = new Date();

    const task1 = tasks.filter(task => task.deadlineDateTime > currDate);
    const task2 = tasks.filter(task => task.deadlineDateTime <= currDate);

    res.locals.moment = moment;
    res.render("allTask", { title: "Task List", task1,task2,currDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateController = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    res.locals.moment = moment;

    res.render("update", { title: "Update", tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const aboutController = (req, res, next) => {
  try {
    res.render("about", { title: "About" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTaskFormController = (req, res, next) => {
  try {
    const currDate = new Date();
    const formattedDate = moment(currDate).format("YYYY-MM-DD");
    const formattedTime = moment(currDate).format("HH:mm");
    res.render("newTask", { title: "New Task" , formattedDate, formattedTime});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskFormController = async (req, res, next) => {
  try {
    const { id } = req.query;
    const task = await Task.findById(id);

    res.locals.moment = moment;

    res.render("updateTask", { title: "Update Task", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTaskPageController = async (req, res, next) => {
  try {
    const { id } = req.query;
    const task = await Task.findById(id);
    res.render("deleteTask", { title: "Delete Task", id ,task});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTaskController = async (req, res, next) => {
  try {
    const { title, snippet, desc, deadline_date, deadline_time} = req.body;

    const deadlineDateTime = new Date(deadline_date);
    const [hours, minutes] = deadline_time.split(":").map(Number);
    deadlineDateTime.setHours(hours, minutes, 0, 0);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ title, snippet, desc ,deadlineDateTime});
    await newTask.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, snippet, desc , done, deadline_date, deadline_time} = req.body;

    const deadlineDateTime = new Date(deadline_date);
    const [hours, minutes] = deadline_time.split(":").map(Number);
    deadlineDateTime.setHours(hours, minutes, 0, 0);

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Not found the Task!" });
    }

    task.title = title;
    task.snippet = snippet;
    task.desc = desc;
    task.deadlineDateTime = deadlineDateTime;

    if(done === "true") task.done = true;
    else if(done === "false") task.done = false;

    await task.save();

    res.redirect("/update");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const doneTaskController = async (req, res, next) => {
  try {
    const { id , isDone} = req.query;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Not found the Task!" });
    }
    task.done = isDone;

    await task.save();
    res.redirect("/");

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTaskController = async (req, res, next) => {
  try {
    const { id, confirm } = req.query;

    if (confirm === "yes") {
      await Task.findByIdAndDelete(id);
    }

    res.redirect("/update");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const pageNotFoundController = (req, res) => {
  res.status(404).render('404', { title: '404' });
}

module.exports = {
  updateController,
  taskListController,
  aboutController,
  addTaskFormController,
  updateTaskFormController,
  deleteTaskPageController,
  addTaskController,
  updateTaskController,
  deleteTaskController,
  pageNotFoundController,
  doneTaskController
};
