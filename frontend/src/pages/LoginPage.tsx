import { Link } from "react-router-dom";
import "./auth.css";
import useWindowWidth from "../hooks/useWindowWidth";

export default function LoginPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
          <form className="auth-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}
