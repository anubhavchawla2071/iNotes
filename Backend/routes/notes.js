const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const { findById } = require("../models/Notes");
const router = express.Router();

// Route 1: fetching all notes of a user using GET : /api/notes/fetchnotes
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2: Add a new note using POST : /api/notes/addnote  Login required
router.post(
  "/addnote",
  [
    body("title", "Title should be of minimum 3 characters").isLength({
      min: 3,
    }),
    body("description", "description should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const { title, description, tag } = req.body;
    // if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let note = new Notes({ title, description, tag, user: req.user.id });
      const savedNoted = await note.save();
      res.json(savedNoted);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3: Updating an existing note using PUT : /api/notes/updatenote:id  Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // store the new note valye by user in newNote object
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
      return res.status(404).send("Not found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 4: Delete an existing note using DELETE : /api/notes/deletenote:id  Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
      let note = await Notes.findById(req.params.id);

      // If note does not exist send error
      if (!note) {
        return res.status(404).send("Not found");
      }

      //Delete if user owns this note
      if (note.user.toString() != req.user.id) {
       return res.status(401).send("Not allowed");
      }
  
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({"status" : "success"});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });


module.exports = router;
