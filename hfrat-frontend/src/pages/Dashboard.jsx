import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

/* ===== Recharts imports ===== */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* ======================
     STATUS COLOR HELPER
     ====================== */
  const statusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "#ff4d4f"; // red
      case "WARNING":
        return "#faad14"; // amber
      case "NORMAL":
        return "#52c41a"; // green
      default:
        return "#ccc";
    }
  };

  /* ======================
     LOAD OVERVIEW
     ====================== */
  useEffect(() => {
    apiFetch("/dashboard/overview")
      .then((res) => {
        setFacilities(res);
      })
      .catch(console.error);
  }, []);

  /* ======================
     LOAD FACILITY DETAILS
     ====================== */
  const openFacility = async (facilityId) => {
    setLoadingDetails(true);
    try {
      const data = await apiFetch(`/dashboard/facility/${facilityId}`);
      setSelectedFacility(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* ======================
          MAIN DASHBOARD
          ====================== */}
      <div style={{ flex: 1, paddingRight: "2rem" }}>
        <h2>Monitor Dashboard</h2>
        <p style={{ opacity: 0.7 }}>
          Real-time overview of reported health facility resources
        </p>

        {/* ===== Current Status ===== */}
        <h3>Current Status</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {facilities.map((f) => (
            <div
              key={f.facility_id}
              onClick={() => openFacility(f.facility_id)}
              style={{
                cursor: "pointer",
                background: "#1e1e1e",
                border: `1px solid ${statusColor(f.status)}`,
                borderRadius: "8px",
                padding: "1.25rem",
              }}
            >
              <h4>{f.facility}</h4>
              <p>
                Status:{" "}
                <strong style={{ color: statusColor(f.status) }}>
                  {f.status}
                </strong>
              </p>
              <small>
                Last updated:{" "}
                {new Date(f.last_updated).toLocaleString()}
              </small>
            </div>
          ))}
        </div>

        {/* ===== 7-Day Trends ===== */}
        <h3 style={{ marginTop: "3rem" }}>7-Day Trends</h3>

        {selectedFacility && selectedFacility.history.length > 0 ? (
          <div
            style={{
              height: 300,
              background: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedFacility.history}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(v) =>
                    new Date(v).toLocaleString()
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="icu_beds_available"
                  stroke="#ff4d4f"
                  name="ICU Beds"
                />
                <Line
                  type="monotone"
                  dataKey="total_ventilators"
                  stroke="#faad14"
                  name="Ventilators"
                />
                <Line
                  type="monotone"
                  dataKey="medical_doctors"
                  stroke="#52c41a"
                  name="Doctors"
                />
                <Line
                  type="monotone"
                  dataKey="nurses"
                  stroke="#1890ff"
                  name="Nurses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            style={{
              border: "1px dashed #444",
              padding: "2rem",
              borderRadius: "8px",
              opacity: 0.7,
            }}
          >
            No historical data to display yet.
          </div>
        )}
      </div>

      {/* ======================
          SIDE PANEL
          ====================== */}
      <aside
        style={{
          width: "320px",
          background: "#121212",
          borderLeft: "1px solid #333",
          padding: "1.5rem",
        }}
      >
        {!selectedFacility && (
          <p style={{ opacity: 0.6 }}>
            Select a facility to view details
          </p>
        )}

        {loadingDetails && <p>Loading…</p>}

        {selectedFacility && selectedFacility.latest_report && (
          <>
            <h3>{selectedFacility.facility}</h3>

            <h4 style={{ marginTop: "1rem" }}>Latest Report</h4>

            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>ICU Beds: {selectedFacility.latest_report.icu_beds_available}</li>
              <li>Ventilators: {selectedFacility.latest_report.total_ventilators}</li>
              <li>Doctors: {selectedFacility.latest_report.medical_doctors}</li>
              <li>Nurses: {selectedFacility.latest_report.nurses}</li>
              <li>Ambulance: {selectedFacility.latest_report.ambulance}</li>
              <li>Incubators: {selectedFacility.latest_report.incubators}</li>
              <li>Anaesthesia Machines: {selectedFacility.latest_report.anaesthesia_machines}</li>
              <li>
                Blood Types:{" "}
                {Array.isArray(selectedFacility.latest_report.blood_types_available)
                  ? selectedFacility.latest_report.blood_types_available.join(", ")
                  : "N/A"}
              </li>
            </ul>

            <small style={{ opacity: 0.6 }}>
              Updated:{" "}
              {new Date(
                selectedFacility.latest_report.created_at
              ).toLocaleString()}
            </small>
          </>
        )}
      </aside>
    </div>
  );
}

export default Dashboard;
