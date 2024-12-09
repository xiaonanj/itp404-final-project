import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListDisplay from "../components/ListDisplay";

const API_URL = `${process.env.REACT_APP_API_URL}/comments`;
const LEGAL_RULES_API_URL = `${process.env.REACT_APP_API_URL}/legalRules`;
const USERS_API_URL = `${process.env.REACT_APP_API_URL}/users`;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [legalRules, setLegalRules] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState({
    userId: "",
    legalRuleId: "",
    content: "",
  });
  const [newUserName, setNewUserName] = useState("");
  const [useExistingUser, setUseExistingUser] = useState(true);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Comments | Legal Tracker";
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => {
        console.error("Error fetching comments:", error);
        toast.error(`Error fetching comments: ${error.message}`);
      });

    fetch(LEGAL_RULES_API_URL)
      .then((response) => response.json())
      .then((data) => setLegalRules(data))
      .catch((error) => {
        console.error("Error fetching legal rules:", error);
        toast.error(`Error fetching legal rules: ${error.message}`);
      });

    fetch(USERS_API_URL)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error(`Error fetching users: ${error.message}`);
      });
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!useExistingUser && newUserName.trim() === "") {
      newErrors.newUserName = "Please enter a user name.";
    }

    if (useExistingUser && newComment.userId === "") {
      newErrors.userId = "Please select an existing user.";
    }

    if (newComment.legalRuleId === "") {
      newErrors.legalRuleId = "Please select a legal rule.";
    }

    if (newComment.content.trim() === "") {
      newErrors.content = "Please enter a comment.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new comment, including creating a new user if necessary
  const handleAddComment = async () => {
    setFormSubmitted(true);
    if (!validateForm()) return;

    let userId = newComment.userId;

    if (!useExistingUser) {
      try {
        const newUser = await fetch(USERS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newUserName }),
        }).then((response) => response.json());

        userId = newUser.id;
        setUsers((prevUsers) => [...prevUsers, newUser]);
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error(`Error creating user: ${error.message}`);
        return;
      }
    }

    // Add the new comment with a timestamp
    const newCommentWithTimestamp = {
      userId,
      legalRuleId: newComment.legalRuleId,
      content: newComment.content,
      timestamp: new Date().toISOString(),
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCommentWithTimestamp),
    })
      .then((response) => response.json())
      .then((createdComment) => {
        setComments([createdComment, ...comments]);
        toast.success("Comment added successfully!");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        toast.error(`Error adding comment: ${error.message}`);
      });

    setNewComment({ userId: "", legalRuleId: "", content: "" });
    setNewUserName("");
    setUseExistingUser(true);
    setErrors({});
    setFormSubmitted(false);
  };

  // Handle input changes for form fields
  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });

    if (formSubmitted) {
      setFormSubmitted(false);
    }

    if (field === "userId") {
      setNewComment({ ...newComment, userId: value });
    } else if (field === "legalRuleId") {
      setNewComment({ ...newComment, legalRuleId: value });
    } else if (field === "content") {
      setNewComment({ ...newComment, content: value });
    } else if (field === "newUserName") {
      setNewUserName(value);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setComments(comments.filter((comment) => comment.id !== id));
        toast.success("Comment deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        toast.error(`Error deleting comment: ${error.message}`);
      });
  };

  // Render the Comments component
  return (
    <div className="container">
      <h1>Comments</h1>

      <h2>Add a Comment</h2>
      {formSubmitted && Object.keys(errors).length > 0 && (
        <div className="alert alert-danger">
          Please correct the highlighted errors before submitting.
        </div>
      )}

      <div className="mb-2">
        <label className="form-check-label me-2">
          <input
            type="radio"
            name="userType"
            checked={useExistingUser}
            onChange={() => setUseExistingUser(true)}
            className="form-check-input me-1"
          />
          Select Existing User
        </label>
        <label className="form-check-label">
          <input
            type="radio"
            name="userType"
            checked={!useExistingUser}
            onChange={() => setUseExistingUser(false)}
            className="form-check-input me-1"
          />
          Enter New User Name
        </label>
      </div>

      {/* Conditional rendering for user input */}
      {useExistingUser ? (
        <>
          <select
            value={newComment.userId}
            onChange={(e) => handleInputChange("userId", e.target.value)}
            className={`form-select mb-2 ${errors.userId ? "is-invalid" : ""}`}
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter new user name"
            value={newUserName}
            onChange={(e) => handleInputChange("newUserName", e.target.value)}
            className={`form-control mb-2 ${errors.newUserName ? "is-invalid" : ""}`}
          />
          {errors.newUserName && <div className="invalid-feedback">{errors.newUserName}</div>}
        </>
      )}

      <select
        value={newComment.legalRuleId}
        onChange={(e) => handleInputChange("legalRuleId", e.target.value)}
        className={`form-select mb-2 ${errors.legalRuleId ? "is-invalid" : ""}`}
      >
        <option value="">Select a Legal Rule</option>
        {legalRules.map((rule) => (
          <option key={rule.id} value={rule.id}>
            {rule.title}
          </option>
        ))}
      </select>
      {errors.legalRuleId && <div className="invalid-feedback">{errors.legalRuleId}</div>}

      <textarea
        placeholder="Write your comment here..."
        value={newComment.content}
        onChange={(e) => handleInputChange("content", e.target.value)}
        className={`form-control mb-2 ${errors.content ? "is-invalid" : ""}`}
      ></textarea>
      {errors.content && <div className="invalid-feedback">{errors.content}</div>}

      <button className="btn btn-primary" onClick={handleAddComment}>
        Add Comment
      </button>

      <ListDisplay
        items={comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
        header="All Comments"
        renderItem={(comment) => {
          const associatedRule = legalRules.find((rule) => rule.id === comment.legalRuleId);
          const commenter = users.find((user) => user.id === comment.userId);

          return (
            <>
              <h5>
                {commenter ? commenter.name : "Unknown User"} on "
                {associatedRule ? associatedRule.title : "Unknown Rule"}"
              </h5>
              <p>{comment.content}</p>
              <small>{new Date(comment.timestamp).toLocaleString()}</small>
              <div>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete Comment
                </button>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default Comments;
