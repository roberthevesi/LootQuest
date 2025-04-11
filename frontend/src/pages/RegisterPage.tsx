import { Link } from "react-router-dom";
import "./auth.css";

export default function RegisterPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
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
