import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import ListDisplay from "../components/ListDisplay";

const Home = () => {
  const legalRules = useLoaderData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterJurisdiction, setFilterJurisdiction] = useState("");

  useEffect(() => {
    document.title = "Home | Legal Tracker";
  }, []);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterJurisdiction("");
  };

  const filteredLegalRules = legalRules.filter(
    (rule) =>
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "" || rule.type === filterType) &&
      (filterJurisdiction === "" || rule.jurisdiction === filterJurisdiction)
  );

  return (
    <div>
      <h1>Welcome to Legal Rules Tracker</h1>
      <p>
        Use this application to search, bookmark, and annotate legal rules for
        your cases and studies.
      </p>

      {/* Filter legal rules */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-2"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-select mb-2"
        >
          <option value="">Filter by Type</option>
          <option value="statute">Statute</option>
          <option value="precedent">Precedent</option>
        </select>

        <select
          value={filterJurisdiction}
          onChange={(e) => setFilterJurisdiction(e.target.value)}
          className="form-select mb-2"
        >
          <option value="">Filter by Jurisdiction</option>
          <option value="federal">Federal</option>
          <option value="state">State</option>
        </select>

        <button className="btn btn-secondary" onClick={handleClearSearch}>
          Clear Search
        </button>
      </div>

      {/* See existing legal rules */}
      <ListDisplay
        items={filteredLegalRules}
        renderItem={(rule) => (
          <div
            onClick={() => navigate(`/search/${rule.id}`)}
            style={{ cursor: "pointer" }}
          >
            <strong>{rule.title}</strong>
            <p>{rule.description}</p>
          </div>
        )}
        header="Legal Rules Database"
      />
    </div>
  );
};

export default Home;
