import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NoteDetail = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    document.title = "Edit Notes | Legal Tracker";
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/notes/${noteId}`)
      .then((response) => response.json())
      .then((data) => {
        setNote(data);
        setEditedContent(data.content);
        setIsReviewed(data.isReviewed);
      })
      .catch((error) => {
        console.error("Error fetching note details:", error);
      });
  }, [noteId]);

  const handleSave = () => {
    const updatedNote = {
      ...note,
      content: editedContent,
      isReviewed: isReviewed,
    };

    fetch(`${process.env.REACT_APP_API_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update note");
        return response.json();
      })
      .then(() => {
        toast.success("Note updated successfully!");
        navigate("/notes");
      })
      .catch((error) => {
        toast.error("Error updating note: " + error.message);
      });
  };

  if (!note) return <div>Loading note details...</div>;

  return (
    <div className="container">
      <h2>Note Details</h2>
      <div className="form-group">
        <label htmlFor="noteContent">Edit Note Content</label>
        <textarea
          id="noteContent"
          className="form-control"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      </div>
      <div className="form-check">
        <input
          id="isReviewed"
          type="checkbox"
          className="form-check-input"
          checked={isReviewed}
          onChange={(e) => setIsReviewed(e.target.checked)}
        />
        <label htmlFor="isReviewed" className="form-check-label">
          Reviewed
        </label>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Save Changes
      </button>
      <button
        className="btn btn-secondary mt-3 ms-2"
        onClick={() => navigate("/notes")}
      >
        Back to Notes
      </button>
    </div>
  );
};

export default NoteDetail;