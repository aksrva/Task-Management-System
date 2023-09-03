const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const absPath = path.join(__dirname, "public");
const ejs = require("ejs");
app.use(express.static(absPath));
app.use(express.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
// app engine
app.set("view engine", "ejs");
app.set("views", absPath + "/views");
// connect database

async function main(){
  await mongoose.connect(`mongodb+srv://tmssystem:TJyFVbm3nipbipY8@tms.6hi1b0i.mongodb.net/taskmanagementsystem?retryWrites=true&w=majority`);
  console.log("Server connected");
}
main().catch(err => console.log("Database error : " + err));

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  task_description: { type: String, required: true },
  status: { type: String, required: true },
});
const Task = mongoose.model("Task", taskSchema, "tasks");

app.get("/", async (req, res) => {
  const todo = await Task.find({ status: "todo" }, "-status");
  const doing = await Task.find({ status: "doing" }, "-status");
  const done = await Task.find({ status: "done" }, "-status");
  res.render("index", { todo, doing, done });
});
app.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const resp = await newTask.save();
    if (!resp) {
      throw new Error("Card not saved!");
    }
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json("Error" + err.message);
  }
});
app.put("/update/:update_id/:uTitle/:uDesc", async (req, res) => {
  try {
    const uId = req.params.update_id;
    const updateResp = await Task.updateOne(
      { _id: uId },
      { $set: { task: req.params.uTitle, task_description: req.params.uDesc } }
    );
    if (updateResp.modifiedCount === 1) {
      res.status(200).json("Task Updated");
    }
  } catch (err) {
    res.status(400).json("Task Updated Failed!!");
  }
});
app.delete("/:task_list/:del_id", async (req, res) => {
  const taskList = req.params.task_list;
  const delId = req.params.del_id;
  try {
    const delResp = await Task.deleteOne({ _id: delId });
    if (delResp.deletedCount == 0) {
      throw new Error("Task Not deleted");
    }
    const taskData = await Task.find({ status: taskList });
    res.status(200).json(taskData);
  } catch (err) {
    res.status(400).json("Task Deleted Failed!!");
  }
});
app.put("/:uStatus/:update_id", async (req, res) => {
  try {
    const uStatus = req.params.uStatus;
    const uId = req.params.update_id;

    const updateResp = await Task.updateOne(
      { _id: uId },
      { $set: { status: uStatus } }
    );
    if (updateResp.modifiedCount === 1) {
      res.status(200).json("Task Updated");
    }
  } catch (err) {
    res.status(400).json("Task Updated Failed!!");
  }
});


app.listen(PORT, () => {
  console.log("Server is started at port " + PORT);
});
