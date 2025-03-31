import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import QueryPage from "./components/QueryPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { motion } from "framer-motion";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <motion.div className="container mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/query" /> : <AuthPage setToken={setToken} setLoading={setLoading} />}
          />
          <Route
            path="/query"
            element={token ? <QueryPage token={token} setToken={setToken} />: <Navigate to="/" />}
          />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;
