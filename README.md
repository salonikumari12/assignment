# TaskFlow — Team Task Manager

A full-stack team task management platform with role-based access control, built with **React + TypeScript + Vite** (frontend) and **Node.js + Express + TypeScript + MongoDB** (backend).

---

## 🚀 Live Demo

- **App**: [https://your-app.railway.app](https://your-app.railway.app)
- **API**: [https://your-api.railway.app](https://your-api.railway.app)

---

## ✨ Features

- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **Role-Based Access Control** — Admin & Member roles (first registered user = Admin)
- **Projects** — Create, edit, delete projects; manage team members by email
- **Tasks** — Create tasks with title, description, priority, due date, assignee
- **Status Tracking** — To Do → In Progress → Done with inline status updates
- **Dashboard** — Real-time stats: total tasks, by status, overdue count, progress bar
- **Filtering** — Filter tasks by status, priority, or project

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt |
| UI Libraries | Lucide React, React Hot Toast, React Router DOM |
| Deployment | Railway (backend + frontend) |

---

## 📁 Project Structure

```
Assistment/
├── backend/
│   ├── src/
│   │   ├── config/db.ts          # MongoDB connection
│   │   ├── middleware/auth.ts    # JWT + role middleware
│   │   ├── models/               # User, Project, Task schemas
│   │   ├── controllers/          # Auth, Project, Task logic
│   │   ├── routes/               # Express route definitions
│   │   └── index.ts              # Express app entry
│   ├── .env                      # Environment variables
│   ├── railway.json              # Railway deployment config
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/           # Layout, TaskCard, Modals, StatCard
    │   ├── context/AuthContext   # Global auth state
    │   ├── lib/api.ts            # Axios instance with JWT interceptor
    │   ├── pages/                # Dashboard, Projects, Tasks, Auth pages
    │   └── App.tsx               # Router setup
    ├── .env                      # VITE_API_URL
    └── package.json
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register (1st user = Admin) |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Current user info |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Member+ | List user's projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Member+ | Project details + tasks |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project + tasks |
| POST | `/api/projects/:id/members` | Admin | Add member by email |
| DELETE | `/api/projects/:id/members/:uid` | Admin | Remove member |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Member+ | List tasks (filterable) |
| POST | `/api/tasks` | Member+ | Create task |
| GET | `/api/tasks/:id` | Member+ | Single task |
| PUT | `/api/tasks/:id` | Member+ | Update task / status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET | `/api/tasks/dashboard` | Member+ | Aggregated stats |

---

## 🏃 Local Development

### Backend
```bash
cd backend
npm install
# Set .env: MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Set .env: VITE_API_URL=http://localhost:3000/api
npm run dev
```

---

## 🚂 Railway Deployment

### Backend
1. Create a new Railway project → "Deploy from GitHub repo" → select `backend/`
2. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://...  (MongoDB Atlas)
   JWT_SECRET=your_strong_secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.railway.app
   ```
3. Railway auto-runs `npm run build && npm start`

### Frontend
1. Create another Railway service → select `frontend/`
2. Set:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
3. Build command: `npm run build`  
   Start command: `npx serve dist`

---

## 👥 Role-Based Access

| Action | Admin | Member |
|--------|-------|--------|
| Create/Edit/Delete projects | ✅ | ❌ |
| Add/Remove members | ✅ | ❌ |
| Create/Edit tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| Delete tasks | ✅ | ❌ |
| View dashboard | ✅ | ✅ (own scope) |

---

## 📄 License

MIT
