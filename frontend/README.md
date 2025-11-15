# Hardware-as-a-Service (HaaS) Frontend

A React-based frontend application for the Hardware-as-a-Service system.

## Features

- User authentication (Sign up / Sign in)
- Project management (Create / Join projects)
- Hardware resource management (Checkout / Check-in)
- State persistence using localStorage
- Modern, responsive UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure API URL (optional):

   - Default: `http://localhost:5000/api`
   - To change, create a `.env` file in the `frontend` directory:

   ```
   VITE_API_BASE_URL=http://your-backend-url/api
   ```

3. Start the development server:

```bash
npm run dev
```

4. Make sure the backend server is running (in `SweLab-/haas_backend/`)

## Project Structure

- `src/components/` - React components (Login, SignUp, ProjectManagement, HardwareManagement, Status)
- `src/context/` - React contexts for authentication and app state
- `src/services/` - API service layer
- `src/config.js` - Configuration file for API URL

## Test Cases Covered

The application supports all required test cases:

1. Sign up as new user
2. Sign in with correct credentials
3. Sign in with wrong credentials (error handling)
4. Create new project
5. Try creating project with existing ID (error handling)
6. Join existing project
   7-12. Hardware checkout/checkin with quantity validation
7. Log off
8. State persistence (login again to see persisted state)
   15-20. Multi-user scenarios and authorization

## Notes

- User authentication state is persisted in localStorage
- Project selection is persisted in localStorage
- Hardware availability is tracked in localStorage
- The backend API endpoints are expected to be running on the configured URL
