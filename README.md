# 🚀 AscendPath

---

## 🏆 Team Details & Overview

- **Team Name:** [Your Team Name Here]
- **Problem Statement Name:** [Insert Problem Statement Name]
- **Project Title:** AscendPath
- **Brief Project Description:**  
  AscendPath is a modern web application that generates personalized learning roadmaps for students and working professionals. Leveraging Supabase, Gemini API, and IBM Watson AI, AscendPath delivers tailored educational paths and interactive guidance via Edura, an AI-powered chatbot. The platform aims to make learning accessible, effective, and engaging for everyone.

---

## 📋 Table of Contents
1. [Why AscendPath?](#-why-ascendpath)
2. [Key Features](#-key-features)
3. [Meet Edura: Your Educational Chatbot](#-meet-edura-your-educational-chatbot)
4. [Live Demo & Video](#-live-demo--video)
5. [Quick Start](#️-quick-start)
6. [Tech Stack](#-tech-stack)
7. [Authentication](#-authentication)
8. [Supabase Integration](#-supabase-integration)
9. [How to Contribute](#️-how-to-contribute)
10. [Deployment](#-deployment)
11. [FAQs](#-faqs)
12. [Final Thoughts](#-final-thoughts)

---

## 🌟 Why AscendPath?

- **Personalized Learning Roadmaps:** Tailored educational paths based on user input.
- **Empowering Working professionals & Students:** Focused on making learning accessible and effective.
- **Modern Tech Stack:** Built with Supabase, React, Tailwind CSS, Gemini API, and IBM Watson AI.
- **Scalable & Modular:** Designed for flexibility and future innovation.

---

## ✨ Key Features

- **AI-Powered Recommendations:** Uses Gemini API and IBM Watson AI to generate customized learning paths.
- **Secure Authentication:** Token-based authentication with support for OAuth2 providers (Google, GitHub).
- **Real-Time Database:** Powered by Supabase for seamless data handling.
- **Responsive UI:** Optimized for all devices with Tailwind CSS.
- **Collaborative Ready:** Easy to extend and integrate new features.
- **Educational Chatbot:** Edura, an AI-powered assistant (powered by Gemini API & Watson AI) for guiding users and answering educational queries.

---

## 🤖 Meet Edura: Your Educational Chatbot

AscendPath features **Edura**, an AI-powered chatbot designed to assist users in navigating the website and answering educational queries.

### Key Abilities
- **Personalized Assistance:** Guides users through the platform and helps them make the most of its features.
- **Educational Queries:** Provides quick answers to common questions about learning resources and roadmaps using Gemini API and Watson AI.
- **User-Friendly Interface:** Seamless interaction with a responsive and intuitive design.

### How It Works
- Edura leverages advanced AI techniques (Gemini API and Watson AI) to understand user queries and offer relevant responses.
- Integrated with the platform to provide contextual help and recommendations.

### Example Use Cases
- Ask Edura: "What is the best roadmap to learn Python?"
- Navigate the platform: "How do I access my saved roadmaps?"
- Get educational tips: "What resources are available for web development?"

Feel free to explore and interact with Edura to make your learning journey smoother and more engaging!

---

## 🚀 Live Demo & Video

- **Live Demo:** [AscendPath](https://ascendpath.xyz)
- **Demo Video (max 2 minutes):** [Watch here](#) <!-- Replace # with your demo video link -->

---

## 🛠️ Quick Start

Follow these steps to set up the project locally in under 5 minutes:

### Prerequisites
1. **Node.js** and **npm**: Download [here](https://nodejs.org/).
2. **Supabase Account**: Sign up [here](https://supabase.com/).
3. **IBM Watson Account**: Sign up [here](https://www.ibm.com/cloud/watson-assistant).
4. **Gemini API Access**: Learn more [here](https://ai.google.dev/gemini-api/docs/).

### Steps
1. Clone the repository and navigate into the project:
   ```sh
   git clone https://github.com/shivam0897-i/ascendpath.git
   cd ascendpath
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Supabase, Gemini API, and Watson AI credentials:
     ```env
     SUPABASE_URL=<your-supabase-url>
     SUPABASE_ANON_KEY=<your-anon-key>
     GEMINI_API_KEY=<your-gemini-api-key>
     WATSON_API_KEY=<your-watson-api-key>
     WATSON_ASSISTANT_ID=<your-watson-assistant-id>
     WATSON_URL=<your-watson-url>
     ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

---

## 🧰 Tech Stack

**Frontend**
- **React:** Dynamic user interfaces.
- **TypeScript:** Type-safe and scalable code.
- **Tailwind CSS:** Sleek and responsive styling.
- **shadcn-ui:** Modern UI components.

**Backend / AI**
- **Supabase:** Real-time database and authentication.
- **Gemini API:** AI-powered roadmap generation.
- **IBM Watson AI:** Conversational AI and natural language understanding.

**DevOps**
- **Vite:** Fast build tool and development server.
- **Vercel:** Effortless deployment and hosting.

---

## 🔒 Authentication

### Overview
The project includes secure token-based authentication, with role-based access control (RBAC) for managing permissions.

### Setup
1. Add Supabase credentials to the `.env` file:
   ```env
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-anon-key>
   ```

2. Configure third-party login (e.g., Google, GitHub) in the Supabase dashboard.

3. Use the pre-configured authentication APIs to manage user sessions.

---

## 🌐 Supabase Integration

AscendPath uses Supabase for:
1. **Database Management:** Real-time data storage and queries.
2. **Authentication:** Secure user login and role management.

### Example: Supabase Client Setup
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

For more details, check the [Supabase Documentation](https://supabase.com/docs).

---

## 🏗️ How to Contribute

We ❤️ contributions! Here's how you can get involved:

1. **Fork the Repository:**
   Click the "Fork" button at the top-right corner of this page.

2. **Clone Your Fork:**
   ```sh
   git clone https://github.com/<your-username>/ascendpath.git
   cd ascendpath
   ```

3. **Create a New Branch:**
   ```sh
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes:**
   Add your feature or fix bugs.

5. **Commit Your Changes:**
   ```sh
   git commit -m "Add your message"
   ```

6. **Push Your Branch:**
   ```sh
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request:**
   Go to the original repository and click "New Pull Request".

---

## 🏁 Deployment

Deploy your project effortlessly using **Vercel**:

1. Build the project for production:
   ```sh
   npm run build
   ```

2. Push your changes to GitHub.

3. Link your repository to [Vercel](https://vercel.com/).

4. Configure environment variables in the Vercel dashboard.

5. Deploy with one click and share your app with the world!

---

## ❓ FAQs

### Q: What is Edura, and how does it assist users?
A: Edura is an AI-powered chatbot that helps users navigate the platform and provides educational guidance.

### Q: Can I use AscendPath without a Supabase account?
A: No, a Supabase account is required to manage authentication and database features.

### Q: How do I report a bug or suggest a feature?
A: Please create an issue [here](https://github.com/shivam0897-i/AscendPath/issues).

---

## 🎉 Final Thoughts

AscendPath is more than just a tool—it's a step toward accessible and personalized education for everyone. Whether you're exploring innovative solutions or collaborating on impactful ideas, AscendPath is designed to support your learning journey.

Feel free to explore, contribute, and make this project even better. Together, we can create something truly transformative.

✨ **Let’s ascend together!** 🚀
