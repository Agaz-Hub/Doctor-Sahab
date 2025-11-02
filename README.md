# Doctor Sahab

Comprehensive medical appointment platform with a React frontend, Node.js/Express backend, and an auxiliary DocAI microservice for disease prediction (FastAPI + TensorFlow).

This README documents repository structure, prerequisites, how to run each component locally (Windows PowerShell), environment variables, testing hints, and operational notes.

---

## Table of contents

- Project overview
- Repository layout
- Prerequisites
- Local setup and run
  - Backend
  - Frontend
  - DocAI (FastAPI + TensorFlow)
- Environment variables
- Uploads & storage notes
- Development workflow
- Troubleshooting
- Contributing
- License

---

## Project overview

Doctor Sahab is a full-stack app for managing doctor listings, appointments, and patient data. The project includes:

- A React (Vite) frontend served in `frontend/`
- A Node.js/Express backend in `backend/` handling APIs, authentication, file uploads and persistence
- A DocAI microservice in `DocAI/` that loads a pre-trained TensorFlow model to predict diseases from symptoms

Use this README to get the project running locally and to find where to make changes.

---

## Repository layout

- `backend/` - Express backend code, routes, controllers, models, `uploads/` directory for user-uploaded files, and `server.js`.
- `frontend/` - React + Vite single-page app. Source in `src/` and static assets in `public/`.
- `DocAI/` - FastAPI app that exposes prediction endpoints. Contains `main.py`, `model10.keras`, `model_metadata.json`, and a Python virtual environment folder (`myenv/`).
- `README.md` - this file

---

## Prerequisites

- Node.js (v16+ recommended; v18+ preferred) and npm or yarn
- Python 3.8+ and pip
- (Optional) Git for cloning and version control

On Windows PowerShell, prefer using a virtual environment for Python and run Node commands from the project folders.

---

## Local setup and run (PowerShell)

Below are minimal steps to get each component running locally. Run commands from the repository root unless noted.

### Backend

1. Install dependencies and start the server:

```powershell
cd "c:\Users\Agaz Mohammad\Desktop\java\Web Dev\MERN\Doctor Sahab\Code\backend"
npm install
# Run dev server (if configured)
npm run dev
# or (fallback)
node server.js
```

2. Key files:

- `server.js` — backend entry point
- `routes/` — API routes
- `controllers/` — business logic
- `models/` — DB models

3. Ports & API

- The backend typically listens on a port defined in `server.js` or an environment variable (see Environment variables below).

### Frontend

1. Install and run the Vite dev server:

```powershell
cd "c:\Users\Agaz Mohammad\Desktop\java\Web Dev\MERN\Doctor Sahab\Code\frontend"
npm install
npm run dev
```

2. Open the local URL printed by Vite (usually http://localhost:5173) to access the app.

### DocAI (FastAPI + TensorFlow)

The DocAI service lives in `DocAI/` and loads a model file (`model10.keras`) at startup.

1. Prepare and activate a Python virtual environment (PowerShell):

```powershell
cd "c:\Users\Agaz Mohammad\Desktop\java\Web Dev\MERN\Doctor Sahab\Code\DocAI"
# Activate existing env if present
.\myenv\Scripts\Activate.ps1
# OR create a fresh venv and activate
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Start the FastAPI app with uvicorn:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Endpoints in `main.py` include `/predict`, `/predict/batch`, `/symptoms`, `/diseases` and health check `/`.

Notes:

- `main.py` expects `model10.keras` and `model_metadata.json` to be present in the `DocAI/` folder. If missing, startup will fail.

---

## Environment variables

The project may use environment variables for DB connection strings, secrets, and ports. Common variables to set in development:

- `PORT` — backend server port
- `MONGO_URI` — MongoDB connection string (if using MongoDB)
- `JWT_SECRET` — JSON Web Token secret
- `NODE_ENV` — development or production

Create a `.env` file in the `backend/` folder (or set system environment variables) and ensure `.env` is not committed.

Example `.env` (backend/.env):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor_sahab
JWT_SECRET=replace-with-a-secure-secret
NODE_ENV=development
```

---

## Uploads & storage notes

- There is a `backend/uploads/` directory used to store user-submitted files (images etc.). The repository currently contains sample images.
- Best practices:
  - Add `backend/uploads/` to `.gitignore` to prevent sensitive/user data from being committed.
  - Validate uploaded file types and sizes server-side.
  - Store files with randomized names or in a cloud/object store (S3, Cloudinary) for production.
  - Consider retention/cleanup policies to remove old temporary files.

Suggested `.gitignore` addition (repo root):

```
backend/uploads/
.venv/
myenv/
```

If you want, I can add the `.gitignore` entry for you.

---

## Development workflow

- Frontend: develop in `frontend/src`, use Vite hot reload.
- Backend: change files in `backend/` and restart the Node server (or use nodemon for auto-reload).
- DocAI: edit `DocAI/main.py` and model artifacts; use a Python venv and restart uvicorn.

Testing and linting should be added to each component as needed (Jest/React Testing Library for frontend, Mocha/Jest for backend, pytest for DocAI).

---

## Troubleshooting

- Backend fails to start: check `backend/package.json` scripts, ensure `node_modules` exist and `PORT` is free.
- Frontend not loading assets: ensure Vite dev server is running and the backend API base URL is configured correctly in `frontend/context` or environment.
- DocAI model load errors: confirm `model10.keras` and `model_metadata.json` are in `DocAI/` and your Python environment has a compatible TensorFlow installed.

If you want, I can run a quick startup check or syntax check for `DocAI/main.py` in your environment.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Run the relevant component locally and add/modify tests.
3. Open a Pull Request with a description of changes and testing instructions.

Please follow existing code style and add unit tests for new behavior.

---

## License

Specify project license here (e.g., MIT). If no license applies, add one to make reuse intentions explicit.

---

If you'd like, I can also:

- Add `backend/uploads/` to `.gitignore` now
- Add a sample secure upload route in `backend/`
- Run a local check of the DocAI service startup (requires executing uvicorn in your environment)

Tell me which of those you'd like next.
