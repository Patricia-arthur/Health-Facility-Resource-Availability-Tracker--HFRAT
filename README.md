# HFRAT Backend API

**Health Facility Resource Availability Tracker (HFRAT)** — Backend API

This repository contains the backend API for HFRAT, a public health application to track health facility resource availability (e.g., ICU beds, ventilators, staff levels) in real time.

---

## 🧠 Project Overview

HFRAT Backend is a RESTful API built with **Flask** and **PostgreSQL** to:

- Accept and validate reports from health facility reporters
- Authenticate users with role-based access (Admin, Reporter, Monitor)
- Provide endpoints for monitoring and reporting tools
- Serve data for dashboards, alerts, and analytics

This backend powers both the web frontend and any external consumers (e.g., monitoring dashboards).

---

## 🚀 Features

- 🔐 **Role-based authentication**
- 🏥 **Resource availability reporting**
- 📊 **Monitor dashboards API**
- ⚠️ **Alert thresholds** for critical resource levels
- 🪪 Structured and documented API endpoints

---

## 🧱 Tech Stack

| Component | Technology |
|-----------|------------|
| API Server | Flask (Python) |
| Database | PostgreSQL |
| Config | `.env` environment configuration |
| ORM / Models | SQLAlchemy / Flask models |

---

## 📦 Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/Ernestka/hfrat-backend.git
    cd hfrat-backend
    ```

2. **Create & activate Python virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate   # macOS/Linux
    venv\Scripts\activate      # Windows
    ```

3. **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

---

## ⚙️ Configuration

Create a `.env` file in the project root with:




---

## 📌 README for **hfrat_frontend** (React Client)

```markdown
# HFRAT Frontend

**Health Facility Resource Availability Tracker (HFRAT)** — Frontend Web Application

This repository contains the React frontend for HFRAT — a dashboard and reporting portal for tracking health facility resources in real time.

---

## 🎯 Overview

The HFRAT frontend provides:

- 📋 Dynamic forms for reporting facility resources
- 📊 Real-time dashboards for monitoring hospitals
- 👤 Role-based views (Admin, Reporter, Monitor)
- 🔗 Connectivity to the backend API

---

## 🚀 Features

- Responsive UI built with **React**
- Fetches data from Flask backend
- Supports login & protected routes
- Clean dashboard visualization

---

## 🧱 Tech Stack

| Component | Technology |
|-----------|------------|
| UI Framework | React |
| Routing | React Router |
| HTTP Client | Axios / Fetch |
| Styling | CSS / Tailwind / UI library |

---

## 📦 Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/Ernestka/hfrat_frontend.git
    cd hfrat_frontend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

---

## 🔧 Run in Development

Start the React development server:

```bash
npm start

