import { Link } from "react-router-dom";
import "../styles/auth.css";
import useWindowWidth from "../hooks/useWindowWidth";
import logo from "../assets/logo.png"

export default function LoginPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src={logo} alt="Logo" className="logo" />
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
