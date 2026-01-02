import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        HF-RAT
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {!role && (
          <Link to="/login" style={styles.link}>Login</Link>
        )}

        {role === "MONITOR" && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}

        {role === "REPORTER" && (
          <Link to="/report" style={styles.link}>Report</Link>
        )}

        {role && (
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: "64px",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1b1b1b",
    borderBottom: "1px solid #333",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "600",
    letterSpacing: "1px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#eaeaea",
    fontSize: "0.95rem",
  },
  logout: {
    background: "transparent",
    border: "1px solid #555",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
