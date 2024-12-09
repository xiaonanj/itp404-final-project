import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const API_URL = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_NOTES_ENDPOINT}`;
const LEGAL_RULES_API_URL = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_LEGAL_RULES_ENDPOINT}`;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [legalRules, setLegalRules] = useState([]);
  const [newNote, setNewNote] = useState({
    content: "",
    legalRuleId: "",
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    document.title = "Notes | Legal Tracker";
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => {
        console.error("Error fetching notes:", error);
        toast.error(`Error fetching notes: ${error.message}`);
      });
    // Fetch notes and legal rules from the APIs
    fetch(LEGAL_RULES_API_URL)
      .then((response) => response.json())
      .then((data) => setLegalRules(data))
      .catch((error) => {
        console.error("Error fetching legal rules:", error);
        toast.error(`Error fetching legal rules: ${error.message}`);
      });
  }, []);

  // Form validation
  const validateForm = (note) => {
    const newErrors = {};
    if (!note.content.trim()) newErrors.content = "Content is required.";
    if (!note.legalRuleId) newErrors.legalRuleId = "Please select a legal rule.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new note
  const handleAdd = () => {
    setFormSubmitted(true);
    if (!validateForm(newNote)) return;
  
    fetch(`${process.env.REACT_APP_API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then((createdNote) => {
        setNotes([...notes, createdNote]);
        toast.success("Note added successfully!");
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        toast.error(`Error adding note: ${error.message}`);
      });
  
    setNewNote({ content: "", legalRuleId: "" });
    setErrors({});
    setFormSubmitted(false);
    setShowAddForm(false);
  };
  

  // Handle deleting a note
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
        toast.success("Note deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        toast.error(`Error deleting note: ${error.message}`);
      });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewNote({ ...newNote, [field]: value });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });

    if (formSubmitted) {
      setFormSubmitted(false);
    }
  };

  // Reset form and error states
  const resetForm = () => {
    setNewNote({ content: "", legalRuleId: "" });
    setErrors({});
    setFormSubmitted(false);
    setShowAddForm(false);
  };

  // Render the Notes component
  return (
    <div className="container">
      <h1>Notes</h1>

      {/* Display list of existing notes */}
      {notes.length > 0 ? (
        <ul className="list-group">
          {notes.map((note) => {
            const associatedRule = legalRules.find(
              (rule) => rule.id === note.legalRuleId
            );
            return (
              <li key={note.id} className="list-group-item">
                <h5>{associatedRule ? associatedRule.title : "Unknown Rule"}</h5>
                <p>{note.content}</p>
                <div>
                  <Link to={`/notes/${note.id}`} className="btn btn-info me-2">
                    Edit Notes
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No notes found.</p>
      )}

      {/* Add new note form */}
      {showAddForm && (
        <div className="mb-3 mt-4">
          <h2>Add New Note</h2>
          {formSubmitted && Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              Please correct the highlighted errors before submitting.
            </div>
          )}
          <textarea
            placeholder="Write your note here..."
            value={newNote.content}
            onChange={(e) =>
              handleInputChange("content", e.target.value)
            }
            className={`form-control mb-2 ${errors.content ? "is-invalid" : ""}`}
          ></textarea>
          {errors.content && (
            <div className="invalid-feedback">{errors.content}</div>
          )}

          <select
            value={newNote.legalRuleId}
            onChange={(e) =>
              handleInputChange("legalRuleId", e.target.value)
            }
            className={`form-select mb-2 ${
              errors.legalRuleId ? "is-invalid" : ""
            }`}
          >
            <option value="">Select Legal Rule</option>
            {legalRules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.title}
              </option>
            ))}
          </select>
          {errors.legalRuleId && (
            <div className="invalid-feedback">{errors.legalRuleId}</div>
          )}

          <button className="btn btn-primary me-2" onClick={handleAdd}>
            Add Note
          </button>
          <button className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </div>
      )}

      {/* Add note button */}
      {!showAddForm && (
        <button
          className="btn btn-primary mt-4"
          onClick={() => setShowAddForm(true)}
        >
          Add New Note
        </button>
      )}
    </div>
  );
};

export default Notes;
