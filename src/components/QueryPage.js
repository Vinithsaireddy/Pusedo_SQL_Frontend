import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_URL;

const QueryPage = ({ token, setToken }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [validity, setValidity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${backend}/queries/query`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(res.data);

      const explainRes = await axios.post(
        `${backend}/queries/explain`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExplanation(explainRes.data.explanation || "No explanation available.");

      const validityRes = await axios.post(
        `${backend}/queries/validity`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setValidity(validityRes.data.validity || "Validity information not available.");

    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>SQL Query Interface</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      
      <form onSubmit={handleQuerySubmit} className="mb-3">
        <div className="mb-3">
          <label htmlFor="query" className="form-label">Enter Query</label>
          <textarea
            className="form-control"
            id="query"
            rows="3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Running..." : "Execute Query"}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {response && (
        <div className="mt-4">
          <h4>Generated SQL</h4>
          <pre className="bg-light p-2">{response.generatedSQL}</pre>
          
          <h4>Results</h4>
          {response.results.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  {Object.keys(response.results[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {response.results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results found.</p>
          )}
          
          <h4>Explanation</h4>
          <p>{explanation}</p>
          
          <h4>Validity</h4>
          <p>{validity}</p>
        </div>
      )}
    </div>
  );
};

export default QueryPage;
