let express = require("express");
let router = express.Router();
const { body } = require("express-validator");
let Notes = require("../models/Notes");

const fetchUser = require("../middleware/fetchUser");

// route 1: get all user notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(501).send(err + ": internal serve error");
  }
});

// route 2: create and store use notes
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "please enter valid title").isLength({ min: 3 }),
    body(
      "description",
      "length of description should be atleast 5 charecter needed"
    ).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.send(savedNote);
    } catch (error) {
      res.status(501).send(error + " internal server error");
    }
  }
);

// route:3 update notes
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("note not found");
    }

    if (req.user.id !== note.user.toString()) {
      return res.status(404).send("user authentication failed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    const savedNote = await note.save();
    res.send(savedNote);
  } catch (error) {
    res.status(501).send(error + " internal server error");
  }
});

// route:3 deletenotes
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("note not found");
    }

    if (req.user.id !== note.user.toString()) {
      return res.status(404).send("user authentication failed");
    }

    note = await Notes.findByIdAndDelete(note.id);

    if (note) {
      res.json(`deleted note: ${note.title}`);
    }
  } catch (error) {
    res.status(501).send(error + " internal server error");
  }
});

module.exports = router;
