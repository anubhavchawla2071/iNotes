import noteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
  const host = "";
  const [notes, setNotes] = useState([]);

  const getNote = async () => {
    //TODO: API call
    console.log("found call");
    const response = await fetch(`api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },
    });

    const notesList = await response.json();
    setNotes(notesList.notes)
  };

  //Add a note
  const addNote = async (title, description, tag) => {
    //TODO: API call
    const response = await fetch(`api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },

      body: JSON.stringify({title, description, tag,}),
    });
    const json=await response.json();
    console.log(json.notes);
    await getNote();
  };

  //Delete a note
  const deleteNote = async (id) => {
    //TODO: API call
    const response = await fetch(`api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token')
        }})
        const json=await response.json();
        console.log(json);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const json=await response.json();
    console.log(json);
    const newNotes=JSON.parse(JSON.stringify(notes));
    //Logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <noteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote,getNote }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
