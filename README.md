# Imboni Agri-tech

Agricultural decision-support platform for Rwanda, built with a React/Vite frontend and a Python survey-data pipeline.

## Run the web app

Requirements: Node.js 20.19+ or 22.12+ and npm.

```powershell
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Stop the server with `Ctrl+C`.

## Refresh the survey data

After updating the processed CSVs in `data/processed`, regenerate the JSON data used by the dashboard and district views:

```powershell
cd frontend
npm run data:sync
```

The exporter validates the district records and required survey values before writing `frontend/src/data/generatedSurveyData.json`. Run this before starting or building the frontend to include updated figures.

The app currently runs without a backend service. Map tiles require an internet connection; district boundaries are bundled in the frontend.
