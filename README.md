# 🚀 Eight Sorting Algorithms Learning Platform

A modern sorting algorithms learning platform with dark theme and neon-style design, providing interactive algorithm visualization and rich practice questions.

## ✨ Features

### 🎯 Core Features
- **Eight Sorting Algorithms**: Bubble, Selection, Insertion, Shell, Merge, Quick, Heap, and Counting Sort
- **Interactive Visualization**: Real-time animation showing algorithm execution process, with step-by-step, auto-play, and custom input support
- **Multi-language Support**: Code examples in C, C++, Python, Java, JavaScript, TypeScript, C#
- **User System**: Email registration, verification code login, learning progress tracking
- **Question Bank System**: Practice questions categorized by difficulty with automatic wrong answer book functionality

### 🎨 Interface Design
- **Dark Theme**: Dark background with neon colors for a futuristic look
- **Neon Effects**: Neon light glow effects to enhance visual experience
- **Responsive Design**: Perfectly adapted for desktop and mobile devices
- **Smooth Animations**: Framer Motion-driven smooth transition effects

### 📊 Learning Features
- **Algorithm Details**: Time complexity, space complexity, and stability analysis
- **Visualization Controls**: Play, pause, step, reset, custom array
- **Progress Tracking**: Learning statistics, accuracy rate, completed questions
- **Wrong Answer Book**: Automatically saves wrong answers for review

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **Tailwind CSS** - Atomic CSS framework
- **React Router** - Route management
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Chart library

### Backend
- **Node.js** + **Express** + **TypeScript**
- **SQLite** - Lightweight database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **bcryptjs** - Password encryption
- **Helmet** - Security middleware

## 🚀 Quick Start

### Requirements
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation Steps

1. **Clone Project**
```bash
git clone <repository-url>
cd sorting-algorithms-platform
```

2. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Configure Environment Variables**
```bash
# Copy environment variable template
cp server/env.example server/.env

# Edit environment variables
nano server/.env
```

4. **Start Development Server**
```bash
# Start backend server
cd server
npm run dev

# Open new terminal, start frontend server
cd client
npm run dev
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎯 User Guide

### Algorithm Learning
1. Visit the **Algorithm List** page
2. Select an interesting sorting algorithm
3. View algorithm details and complexity analysis
4. Use interactive visualization tools to understand the algorithm process
5. View multi-language code implementations

### Practice Questions
1. Visit the **Question List** page
2. Filter questions by difficulty or algorithm type
3. Submit answers and get instant feedback
4. Review wrong answers in the wrong answer book

### User Features
1. Register account using email
2. Login with verification code
3. View learning progress and statistics
4. Manage personal profile

## 🚀 Deployment Guide

### Automatic Deployment
```bash
# Run deployment script
./deploy.sh
```

### Manual Deployment

#### Frontend Deployment (Vercel/Netlify)
1. Build frontend project
```bash
cd client
npm run build
```

2. Deploy to platform
- **Vercel**: Connect GitHub repository for automatic deployment
- **Netlify**: Upload `dist` folder

#### Backend Deployment (Render/Railway)
1. Configure environment variables
2. Connect GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`

### Environment Variable Configuration

#### Backend Environment Variables
```env
PORT=5000
JWT_SECRET=your-jwt-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000
```

## 📁 Project Structure

```
front_end/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React Context
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend application
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── database/     # Database configuration
│   │   └── index.ts      # Server entry
│   ├── package.json
│   └── tsconfig.json
├── package.json          # Root configuration
├── deploy.sh            # Deployment script
└── README.md           # Project description
```

## 🎨 Design Features

### Dark Theme
- Dark background: `#020617` (dark-950)
- Card background: `rgba(15, 23, 42, 0.8)` (dark-900/80)
- Glass effect: `backdrop-blur-sm`

### Neon Colors
- Primary color: `#00ffff` (neon-blue)
- Success color: `#00ff41` (neon-green)
- Warning color: `#ffff00` (neon-yellow)
- Error color: `#ff00ff` (neon-pink)
- Purple: `#8a2be2` (neon-purple)

### Animation Effects
- Glow animation: `animate-glow`
- Neon pulse: `animate-neon-pulse`
- Float effect: `animate-float`
- Gradient transition: `transition-all duration-300`

## 🤝 Contributing

1. Fork the project
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Submit Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool
- [Express](https://expressjs.com/) - Backend framework
- [SQLite](https://www.sqlite.org/) - Database

---

**🎉 Enjoy learning sorting algorithms!**
