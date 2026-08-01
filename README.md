# 🚀 PrepAI – AI Interview Preparation Platform

PrepAI is an AI-powered interview preparation platform that helps students and job seekers practice technical interviews with personalized AI-generated questions and detailed feedback.

The application simulates real interview sessions, evaluates answers using AI, generates improvement suggestions, and provides a professional dashboard to track interview performance.

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- Secure authentication using Auth.js (NextAuth)
- Protected routes

### 🤖 AI Interview Simulation
- AI-generated interview questions
- Supports multiple roles
- Multiple difficulty levels
- Company-specific interview preparation
- Timer-based interview experience

### 📊 AI Feedback
- Overall interview score
- Technical knowledge evaluation
- Communication analysis
- Confidence assessment
- Problem-solving evaluation
- Strengths & weaknesses
- Question-wise feedback
- Personalized learning roadmap
- Placement readiness prediction

### 📄 PDF Report
- Generate downloadable interview reports
- Professional report layout

### 📈 Dashboard
- Overall AI score
- Total interviews completed
- Favorite role
- Recent interview history

### 👤 Profile
- Manage profile information
- Experience level
- Preferred role
- Target company
- Skills

### 📚 Interview History
- View all previous interviews
- Review previous AI feedback
- Access reports anytime

### 🎨 Modern UI
- Responsive design
- Skeleton loading screens
- Animated loading states
- AI Assistant toast notifications
- Dark theme interface

---

# 🛠 Tech Stack

### Frontend
- Next.js 16
- React 19
- Tailwind CSS

### Backend
- Next.js API Routes
- MongoDB Atlas
- Mongoose

### Authentication
- Auth.js (NextAuth)

### AI
- Google Gemini API

### PDF Generation
- React PDF

---

## 📷 Screenshots

Coming soon...

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/MimansaPatle/PrepAI.git
```

Move into the project

```bash
cd PrepAI
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
MONGODB_URI=YOUR_MONGODB_URI

AUTH_SECRET=YOUR_SECRET

GOOGLE_API_KEY=YOUR_GEMINI_API_KEY

NEXTAUTH_URL=http://localhost:3000
```

Run the project

```bash
npm run dev
```

---

# 📂 Project Structure

```
app/
components/
controllers/
lib/
models/
services/
public/
```

---

# 🚀 Future Improvements

- Admin Dashboard
- Interview Analytics
- AI Voice Interviews
- Leaderboard
- Email Reports
- Interview Sharing
- Multi-language Support

---

# 👩‍💻 Author

**Mimansa Patle**

GitHub:
https://github.com/MimansaPatle

LinkedIn:
(Add your LinkedIn URL)

---

⭐ If you like this project, consider giving it a star!