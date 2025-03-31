import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_URL;

const AuthPage = ({ setToken, setLoading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "signup" : "signin";
      const data = isSignUp ? { username, email, password } : { email, password };
      const response = await axios.post(`${backend}/auth/${endpoint}`, data);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/query");
    } catch (err) {
      setError("Invalid credentials, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">{isSignUp ? "Sign Up" : "Sign In"}</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <p className="mt-3 text-center">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button className="btn btn-link p-0" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
