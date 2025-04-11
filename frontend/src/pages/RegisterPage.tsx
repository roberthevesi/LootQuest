import { Link } from "react-router-dom";
import "./auth.css";

export default function RegisterPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <h1>LootQuest</h1>
          <h2>Register</h2>
          <form className="auth-form">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        <div className="welcome-image-container"></div>
      </div>
    </div>
  );
}
