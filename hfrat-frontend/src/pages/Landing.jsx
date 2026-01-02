import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Health Facility Resource Availability Tracker
        </h1>

        <p style={styles.subtitle}>
          Real-time monitoring of critical healthcare resources across facilities.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primary}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={styles.secondary}
            onClick={() => navigate("/dashboard")}
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    maxWidth: "720px",
    textAlign: "center",
    padding: "2rem",
  },
  title: {
    fontSize: "2.4rem",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: 0.85,
    marginBottom: "2.5rem",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  primary: {
    padding: "0.7rem 1.4rem",
    backgroundColor: "#646cff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondary: {
    padding: "0.7rem 1.4rem",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Landing;
