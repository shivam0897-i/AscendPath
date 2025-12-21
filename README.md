# 🚀 AscendPath

**AI-Powered Career Guidance & Personalized Learning Roadmaps**

[![CI](https://github.com/shivam0897-i/AscendPath/actions/workflows/ci.yml/badge.svg)](https://github.com/shivam0897-i/AscendPath/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ascendpath.xyz)

---

## 🎯 What is AscendPath?

AscendPath is a modern web application that helps students and professionals discover their ideal career paths through AI-powered guidance. The platform generates personalized learning roadmaps, provides career suggestions based on interests and skills, and offers an intelligent chatbot for educational assistance.

**🌐 Live Demo:** [ascendpath.xyz](https://ascendpath.xyz)

---

## ✨ Features

### 🗺️ AI-Generated Learning Roadmaps
- Complete learning paths with phases, milestones, and resources
- YouTube video recommendations for each topic
- Progress tracking and milestone completion
- Save and manage multiple roadmaps

### 📋 Career Questionnaire
- Multi-step questionnaire to assess interests, skills, and preferences
- **AI-powered career suggestions** using Gemini
- Personalized match scores for each career path
- Downloadable results

### 🤖 Edura - AI Educational Chatbot
- Intelligent assistant powered by Gemini AI
- Helps navigate the platform and answers educational queries
- Context-aware responses for learning guidance

### 🔐 Secure Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes and session management
- Row Level Security (RLS) on all data

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Shadcn UI |
| **Backend** | Supabase Edge Functions, Vercel Serverless |
| **Database** | Supabase PostgreSQL with RLS |
| **AI** | Google Gemini API |
| **Auth** | Supabase Auth (Email + OAuth) |
| **Deployment** | Vercel |
| **Testing** | Vitest, React Testing Library |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── gemini.ts          # Chatbot API endpoint
│   └── career-suggestions.ts  # AI career matching
├── src/
│   ├── components/        # React components
│   │   ├── questionnaire/ # Career questionnaire forms
│   │   ├── ui/           # Shadcn UI components
│   │   └── Chatbot.tsx   # Edura chatbot
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities (logger, retry, sanitize)
│   ├── pages/            # Page components
│   └── integrations/     # Supabase client and types
├── supabase/
│   ├── functions/        # Edge functions
│   │   └── generate-roadmap/  # AI roadmap generation
│   └── migrations/       # Database migrations
└── .github/workflows/    # CI pipeline
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google AI (Gemini) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/shivam0897-i/AscendPath.git
cd AscendPath

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your credentials to .env
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key (server-side) | ✅ |
| `YOUTUBE_API_KEY` | YouTube Data API key (optional) | ❌ |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run linting
npm run lint
```

**Current Coverage:** 77 tests passing

---

## 📦 Deployment

The application is deployed on **Vercel** with automatic deployments from the `main` branch.

### Deploy Your Own

1. Fork this repository
2. Import to [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Supabase Setup

1. Create a new Supabase project
2. Run migrations: `supabase db push`
3. Deploy edge functions: `supabase functions deploy`
4. Configure authentication providers

---

## 🔒 Security

- ✅ All API keys are server-side only (never exposed to browser)
- ✅ Row Level Security (RLS) on all database tables
- ✅ Input sanitization for AI prompts
- ✅ Rate limiting on AI endpoints
- ✅ CORS configured for production domain

---

## 📈 Roadmap

- [x] AI-powered roadmap generation
- [x] Career questionnaire with AI suggestions
- [x] Edura chatbot integration
- [x] User authentication & saved roadmaps
- [x] CI/CD pipeline with testing
- [ ] Mobile app (React Native)
- [ ] Community features
- [ ] Mentor matching

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

**HackHawks** - Built with ❤️ for accessible education

---

**✨ Let's ascend together! 🚀**
