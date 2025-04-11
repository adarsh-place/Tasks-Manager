const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    snippet: String,
    desc: String,
    done: { type : Boolean, default : false},
    deadlineDateTime:{type : Date},
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;