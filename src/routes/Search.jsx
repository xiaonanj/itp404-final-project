import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use environment variable for API URL, with a fallback to localhost JSON server
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";
const API_ENDPOINT = `${API_BASE_URL}/legalRules`;

const Search = () => {
  const [legalRules, setLegalRules] = useState([]);
  const [newRule, setNewRule] = useState({
    title: "",
    type: "",
    jurisdiction: "",
    description: "",
  });
  const [editRule, setEditRule] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Search Legal Rules | Legal Tracker";
  }, []);

  useEffect(() => {
    const fetchLegalRules = async () => {
      try {
        const response = await fetch(API_ENDPOINT);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setLegalRules(data);
      } catch (err) {
        console.error("Error fetching legal rules:", err);
        setError(err.message);
        toast.error(`Error fetching legal rules: ${err.message}`);
      }
    };

    fetchLegalRules();
  }, []);

  const validateForm = (rule) => {
    const newErrors = {};
    if (!rule.title.trim()) newErrors.title = "Title is required.";
    if (!rule.type) newErrors.type = "Type is required.";
    if (!rule.jurisdiction) newErrors.jurisdiction = "Jurisdiction is required.";
    if (!rule.description.trim())
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    setFormSubmitted(true);
    if (!validateForm(newRule)) return;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRule),
      });

      if (!response.ok) {
        throw new Error(`Failed to add rule: ${response.status} ${response.statusText}`);
      }

      const createdRule = await response.json();
      setLegalRules([...legalRules, createdRule]);
      toast.success("Legal rule added successfully!");
    } catch (err) {
      console.error("Error adding legal rule:", err);
      toast.error(`Error adding legal rule: ${err.message}`);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    setFormSubmitted(true);
    if (!validateForm(editRule)) return;

    try {
      const response = await fetch(`${API_ENDPOINT}/${editRule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editRule),
      });

      if (!response.ok) {
        throw new Error(`Failed to update rule: ${response.status} ${response.statusText}`);
      }

      const updatedRule = await response.json();
      setLegalRules(
        legalRules.map((rule) =>
          rule.id === updatedRule.id ? updatedRule : rule
        )
      );
      toast.success("Legal rule updated successfully!");
      resetForm();
    } catch (err) {
      console.error("Error updating legal rule:", err);
      toast.error(`Error updating legal rule: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Failed to delete rule: ${response.status} ${response.statusText}`);
      }

      setLegalRules(legalRules.filter((rule) => rule.id !== id));
      toast.success("Legal rule deleted successfully!");
    } catch (err) {
      console.error("Error deleting legal rule:", err);
      toast.error(`Error deleting legal rule: ${err.message}`);
    }
  };

  const resetForm = () => {
    setNewRule({ title: "", type: "", jurisdiction: "", description: "" });
    setEditRule(null);
    setErrors({});
    setFormSubmitted(false);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value, isEdit) => {
    if (isEdit) {
      setEditRule({ ...editRule, [field]: value });
    } else {
      setNewRule({ ...newRule, [field]: value });
    }

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });

    if (formSubmitted) setFormSubmitted(false);
  };

  return (
    <div className="container">
      <h1>Legal Rules</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          Add New Rule
        </button>
      </div>

      {legalRules.length > 0 ? (
        <ul className="list-group">
          {legalRules.map((rule) => (
            <li key={rule.id} className="list-group-item">
              <h5>{rule.title}</h5>
              <p>{rule.description}</p>
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    resetForm();
                    setEditRule(rule);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(rule.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No legal rules found.</p>
      )}

      {/* Add new rule form */}
      {showAddForm && !editRule && (
        <div className="mt-4">
          <h2>Add New Legal Rule</h2>
          {formSubmitted && Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              Please correct the highlighted errors before submitting.
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              value={newRule.title}
              onChange={(e) =>
                handleInputChange("title", e.target.value, false)
              }
              className={`form-control mb-2 ${
                errors.title ? "is-invalid" : ""
              }`}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}

            <div className="mb-2">
              <label className="form-check-label me-2">
                <input
                  type="radio"
                  name="type"
                  value="statute"
                  checked={newRule.type === "statute"}
                  onChange={(e) =>
                    handleInputChange("type", e.target.value, false)
                  }
                  className={`form-check-input me-1 ${
                    errors.type ? "is-invalid" : ""
                  }`}
                />
                Statute
              </label>
              <label className="form-check-label">
                <input
                  type="radio"
                  name="type"
                  value="precedent"
                  checked={newRule.type === "precedent"}
                  onChange={(e) =>
                    handleInputChange("type", e.target.value, false)
                  }
                  className={`form-check-input me-1 ${
                    errors.type ? "is-invalid" : ""
                  }`}
                />
                Precedent
              </label>
            </div>
            {errors.type && <div className="text-danger">{errors.type}</div>}

            <select
              value={newRule.jurisdiction}
              onChange={(e) =>
                handleInputChange("jurisdiction", e.target.value, false)
              }
              className={`form-select mb-2 ${
                errors.jurisdiction ? "is-invalid" : ""
              }`}
            >
              <option value="">Select Jurisdiction</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
            </select>
            {errors.jurisdiction && (
              <div className="invalid-feedback">{errors.jurisdiction}</div>
            )}

            <textarea
              placeholder="Description"
              value={newRule.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value, false)
              }
              className={`form-control mb-3 ${
                errors.description ? "is-invalid" : ""
              }`}
            ></textarea>
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}

            <button className="btn btn-primary me-2" onClick={handleAdd}>
              Add
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit existing rule form */}
      {editRule && (
        <div className="mt-4">
          <h2>Edit Legal Rule</h2>
          {formSubmitted && Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              Please correct the highlighted errors before submitting.
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              value={editRule.title}
              onChange={(e) =>
                handleInputChange("title", e.target.value, true)
              }
              className={`form-control mb-2 ${
                errors.title ? "is-invalid" : ""
              }`}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}

            <div className="mb-2">
              <label className="form-check-label me-2">
                <input
                  type="radio"
                  name="type"
                  value="statute"
                  checked={editRule.type === "statute"}
                  onChange={(e) =>
                    handleInputChange("type", e.target.value, true)
                  }
                  className={`form-check-input me-1 ${
                    errors.type ? "is-invalid" : ""
                  }`}
                />
                Statute
              </label>
              <label className="form-check-label">
                <input
                  type="radio"
                  name="type"
                  value="precedent"
                  checked={editRule.type === "precedent"}
                  onChange={(e) =>
                    handleInputChange("type", e.target.value, true)
                  }
                  className={`form-check-input me-1 ${
                    errors.type ? "is-invalid" : ""
                  }`}
                />
                Precedent
              </label>
            </div>
            {errors.type && <div className="text-danger">{errors.type}</div>}

            <select
              value={editRule.jurisdiction}
              onChange={(e) =>
                handleInputChange("jurisdiction", e.target.value, true)
              }
              className={`form-select mb-2 ${
                errors.jurisdiction ? "is-invalid" : ""
              }`}
            >
              <option value="">Select Jurisdiction</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
            </select>
            {errors.jurisdiction && (
              <div className="invalid-feedback">{errors.jurisdiction}</div>
            )}

            <textarea
              placeholder="Description"
              value={editRule.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value, true)
              }
              className={`form-control mb-3 ${
                errors.description ? "is-invalid" : ""
              }`}
            ></textarea>
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}

            <button className="btn btn-primary me-2" onClick={handleUpdate}>
              Update
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
