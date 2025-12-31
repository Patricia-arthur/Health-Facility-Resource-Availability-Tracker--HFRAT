import { useState } from "react";

function ReporterForm() {
  const [formData, setFormData] = useState({
    icu_beds_available: "",
    incubators: "",
    total_ventilators: "",
    anaesthesia_machines: "",
    defibrillators: "",
    ambulance: "",
    surgeons: "",
    medical_doctors: "",
    nurses: "",
    midwives: "",
    blood_types_available: "",
    other_resources: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated");
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/reports/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        icu_beds_available: Number(formData.icu_beds_available),
        incubators: Number(formData.incubators),
        total_ventilators: Number(formData.total_ventilators),
        anaesthesia_machines: Number(formData.anaesthesia_machines),
        defibrillators: Number(formData.defibrillators),
        ambulance: Number(formData.ambulance),
        surgeons: Number(formData.surgeons),
        medical_doctors: Number(formData.medical_doctors),
        nurses: Number(formData.nurses),
        midwives: Number(formData.midwives),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Submission failed");
      return;
    }

    alert("Report submitted successfully");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Submit Resource Report</h2>

      <form onSubmit={handleSubmit}>
        <h4>Equipment</h4>
        <input name="icu_beds_available" placeholder="ICU Beds Available" onChange={handleChange} />
        <input name="incubators" placeholder="Incubators" onChange={handleChange} />
        <input name="total_ventilators" placeholder="Total Ventilators" onChange={handleChange} />
        <input name="anaesthesia_machines" placeholder="Anaesthesia Machines" onChange={handleChange} />
        <input name="defibrillators" placeholder="Defibrillators" onChange={handleChange} />
        <input name="ambulance" placeholder="Ambulances Available" onChange={handleChange} />

        <h4>Staff on Duty</h4>
        <input name="surgeons" placeholder="Surgeons" onChange={handleChange} />
        <input name="medical_doctors" placeholder="Medical Doctors" onChange={handleChange} />
        <input name="nurses" placeholder="Nurses" onChange={handleChange} />
        <input name="midwives" placeholder="Midwives" onChange={handleChange} />

        <h4>Other Resources</h4>
        <input
          name="blood_types_available"
          placeholder="Blood Types Available (e.g. O+, A-)"
          onChange={handleChange}
        />
        <textarea
          name="other_resources"
          placeholder="Other available resources"
          onChange={handleChange}
        />

        <br />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default ReporterForm;
