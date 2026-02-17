# AstroGuard

## Setup
1. Navigate to the project directory:
   ```bash
   cd AstroG
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application
1. Start the backend server (which also serves the frontend):
   ```bash
   python -m uvicorn backend.main:app --reload
   ```

2. Open your browser to:
   - **Home**: http://localhost:8000
   - **Tracker**: http://localhost:8000/tracker.html
