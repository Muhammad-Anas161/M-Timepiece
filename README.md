# Watch Junction ⌚

A modern e-commerce platform for luxury watches built with React and Express.

## 🏗️ Project Structure

```
Watch-Junction/
├── frontend/          # React + Vite application
├── backend/           # Express API server
└── package.json       # Root workspace scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/watch-junction.git
cd Watch-Junction

# Install all dependencies
npm run install:all
```

### Configuration

1. **Frontend Environment** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

2. **Backend Environment** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
FRONTEND_URL=http://localhost:5173
```

### Run Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 3000)
```

Visit:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/login

## ✨ Features

- 🛍️ Product catalog with 50+ luxury watches
- 🛒 Shopping cart with persistent storage
- 💳 Checkout flow with order management
- 👨‍💼 Admin dashboard for product management
- ⭐ Product reviews and ratings
- 🔗 Related products recommendations
- 🏆 Trust badges and security indicators
- 💱 Multi-currency support (PKR/USD)
- 📱 Fully responsive design
- 🔐 JWT authentication for admin

## 📦 Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: SQLite3
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Validation**: Express Validator

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- **Frontend**: Deploy to Vercel (root: `frontend/`)
- **Backend**: Deploy to Railway (root: `backend/`)

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Run both frontend and backend
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run install:all` - Install all dependencies
- `npm run build:frontend` - Build frontend for production

### Frontend Directory
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Directory
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with products
- `npm run reset-admin` - Reset admin credentials

## 📝 Admin Access

Default credentials (change in production):
- **Username**: admin
- **Password**: password123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Product images from various watch manufacturers
- Icons from Lucide React
- UI inspiration from modern e-commerce platforms
