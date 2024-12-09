import React, { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

const Detail = () => {
  const legalRule = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${legalRule.title} | Legal Tracker`;
  }, [legalRule]);

  // Render the detailed view of the legal rule
  return (
    <div>
      <h1>{legalRule.title}</h1>
      <p>
        <strong>Type:</strong> {legalRule.type}
      </p>
      <p>
        <strong>Jurisdiction:</strong> {legalRule.jurisdiction}
      </p>
      <p>{legalRule.description}</p>
      <h2>Notes</h2>
      <ul className="list-group">
        {legalRule.notes.map((note) => (
          <li key={note.id} className="list-group-item">
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Detail;
