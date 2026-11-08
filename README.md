# 🏫 School Admission Management System

A full-stack web application designed to streamline and digitize school admission workflows. It facilitates the submission of student applications along with supporting documents and profile images, while providing an administrative dashboard for real-time review, status tracking, and record management.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Axios, Lucide React
* **Backend:** Django, Django REST Framework (DRF), django-cors-headers
* **Database:** SQLite
* **Hosting & Deployment:**
  * **Backend (Render):** [https://school-admission-backend-jz8m.onrender.com/api/](https://school-admission-backend-jz8m.onrender.com/api/)
  * **Frontend (Vercel):** [https://school-admission-ten.vercel.app](https://school-admission-ten.vercel.app)

---

## ✨ Core Features & Capabilities

* **Applicant Submissions:** Parents and students can submit structured application forms containing personal details, grade level, gender, extracurricular choices, profile photos, and verification documents (PDFs).
* **Admin Dashboard:** Provides a clear overview with metrics such as Total Applications, Pending Reviews, and Accepted records.
* **Status Management:** Allows administrators to dynamically update application statuses (e.g., Pending, Approved, Rejected).
* **Record Management:** Supports summary analytics fetching and secure applicant record deletion.

---

## 🔌 Architecture & API Endpoints

The backend is structured using Django REST Framework with a default router serving RESTful JSON endpoints under the `/api/` prefix.
* **Base URL (Production):** `https://school-admission-backend-jz8m.onrender.com/api`
* **Key Routes:**
  * `GET /api/submissions/` - Retrieve all applicant submissions.
  * `POST /api/submissions/` - Create a new applicant entry (multipart/form-data for media handling).
  * `DELETE /api/submissions/{id}/` - Remove an existing submission record.
  * `GET /api/submissions/summary/` - Fetch statistical summaries for dashboard counters.

---

## ⚙️ Local Development Setup Guide

To run and evaluate this project locally, follow the steps below:

### Step 1: Clone the Repository
```bash
git clone https://github.com/Dew7975/school-admission.git
cd school-admission
```

### Step 2: Backend Configuration (Django)
```bash
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
*The backend server will run locally at `http://127.0.0.1:8000/api/`*

### Step 3: Frontend Configuration (Next.js)
Open a separate terminal for the frontend directory:
```bash
npm install
# Create .env.local file with the local API endpoint
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local
npm run dev
```
*The frontend application will run locally at `http://localhost:3000`*

---

## 🌐 Live Deployments
* **Live Web Application (Vercel):** [https://school-admission-ten.vercel.app](https://school-admission-ten.vercel.app)
* **Live Backend API (Render):** [https://school-admission-backend-jz8m.onrender.com/api/](https://school-admission-backend-jz8m.onrender.com/api/)
