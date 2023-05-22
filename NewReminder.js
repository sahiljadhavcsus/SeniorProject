const express = require("express");
const NewReminders = require("../models/mongodb_schemas/newreminders");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { title, description, dueDate, bgcolor, time } = req.body;
    const newReminders = new NewReminders({
      title,
      description,
      dueDate,
      bgcolor,
      time,
    });
    await newReminders.save();
    res
      .status(200)
      .send({ message: "Reminders create successfully", data: newReminders });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const data = await NewReminders.find();
    res.status(200).send(data);
  } catch (error) {
    return res.status(401).json({ message: error });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await NewReminders.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Reminders not found" });
    }
    await NewReminders.findByIdAndUpdate(id, data, {
      new: true,
    })
      .then((result) => {
        res
          .status(200)
          .send({ result, message: "Reminders edited successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Id is required" });
    }
    const category = await NewReminders.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Id not found" });
    }
    await NewReminders.findByIdAndDelete({ _id: id })
      .then((result) => {
        return res
          .status(200)
          .send({ message: "Reminders deleted successfully" });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

module.exports = router;
