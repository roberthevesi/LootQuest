import { Link } from "react-router-dom";
import "./auth.css";
import useWindowWidth from "../hooks/useWindowWidth";

export default function RegisterPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

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
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}
