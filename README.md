# 🚀 StartupIQ AI – AI Startup Idea Validation Platform

A modern full-stack SaaS platform that helps entrepreneurs, students, and startup founders validate their startup ideas using Generative AI. Get AI-powered SWOT analysis, market potential, competitor insights, and investor-ready pitch generation.

![StartupIQ AI](https://img.shields.io/badge/StartupIQ-AI%20Platform-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

- **🔐 JWT Authentication** – Secure register, login, and protected routes
- **💡 Startup Idea CRUD** – Create, read, update, and delete startup ideas
- **🤖 AI-Powered Analysis** – Google Gemini AI generates comprehensive reports
- **📊 SWOT Analysis** – Strengths, Weaknesses, Opportunities, Threats
- **📈 Startup Score** – AI rates your idea out of 10
- **🎤 Investor Pitch** – AI-generated pitch for your startup
- **💰 Revenue Suggestions** – Monetization strategy recommendations
- **🚀 Growth Strategy** – Scaling and marketing insights
- **🏢 Competitor Analysis** – Identify key competitors
- **📄 PDF Export** – Download reports as PDF
- **🌓 Dark Mode** – Toggle between light and dark themes
- **📱 Responsive** – Works on all devices
- **🔍 Search & Filter** – Find ideas by title or industry
- **📊 Dashboard** – Analytics charts and statistics

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Animations | Framer Motion |
| PDF | jsPDF |

## 📁 Project Structure

```
StartupIQ AI/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # UI & Layout components
│   │   ├── context/         # Auth, Theme, Toast providers
│   │   ├── lib/             # API client & utilities
│   │   └── pages/           # All page components
│   └── ...
├── server/                  # Express Backend
│   ├── config/              # DB connection
│   ├── middleware/           # JWT auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route handlers
│   └── services/            # AI service integration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/startupiq
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/ideas` | Get all ideas |
| POST | `/api/ideas` | Create idea |
| PUT | `/api/ideas/:id` | Update idea |
| DELETE | `/api/ideas/:id` | Delete idea |
| POST | `/api/ai/analyze/:id` | AI analyze idea |
| GET | `/api/reports` | Get all reports |
| GET | `/api/reports/:id` | Get single report |
| DELETE | `/api/reports/:id` | Delete report |

## 🎨 Design Features

- Glassmorphism cards with backdrop blur
- Gradient backgrounds and text
- Smooth Framer Motion animations
- Custom AI loading animation
- Animated score gauge
- Responsive sidebar navigation
- Toast notification system
- Dark/Light mode with system preference detection

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render)
- Set environment variables in Render dashboard
- Deploy server/ directory
- Update frontend API base URL

## 📝 License

MIT License – Built for learning, portfolios, and startup validation.
