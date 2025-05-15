# 🚀 AscendPath

AscendPath is a modern web application designed to generate personalized learning roadmaps for students and women. By leveraging Supabase and the Gemini API, AscendPath delivers tailored educational strategies to empower learners and simplify their journeys.

---

## 🌟 Why AscendPath?

- **Personalized Learning Roadmaps**: Tailored educational paths based on user input.
- **Empowering Women & Students**: Focused on making learning accessible and effective.
- **Modern Tech Stack**: Built with Supabase, React, and Tailwind CSS.
- **Scalable & Modular**: Designed for flexibility and future innovation.

---

## ✨ Key Features

- **AI-Powered Recommendations**: Uses the Gemini API to generate customized learning paths.
- **Secure Authentication**: Token-based authentication with support for OAuth2 providers (Google, GitHub).
- **Real-Time Database**: Powered by Supabase for seamless data handling.
- **Responsive UI**: Optimized for all devices with Tailwind CSS.
- **Collaborative Ready**: Easy to extend and integrate new features.

---

## 🚀 Live Demo

Check out the live version of AscendPath: [AscendPath](https://ascendpath.vercel.app)

---

## 🛠️ Quick Start

Follow these steps to set up the project locally in under 5 minutes:

### Prerequisites
1. **Node.js** and **npm**: Download [here](https://nodejs.org/).
2. **Supabase Account**: Sign up [here](https://supabase.com/).

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
   - Add your Supabase credentials:
     ```env
     SUPABASE_URL=<your-supabase-url>
     SUPABASE_ANON_KEY=<your-anon-key>
     ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

---

## 🧰 Tech Stack

**Frontend**
- **React**: Dynamic user interfaces.
- **TypeScript**: Type-safe and scalable code.
- **Tailwind CSS**: Sleek and responsive styling.
- **shadcn-ui**: Modern UI components.

**Backend**
- **Supabase**: Real-time database and authentication.
- **Gemini API**: AI-powered roadmap generation.

**DevOps**
- **Vite**: Fast build tool and development server.
- **Vercel**: Effortless deployment and hosting.

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
1. **Database Management**: Real-time data storage and queries.
2. **Authentication**: Secure user login and role management.

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

1. **Fork the Repository**:
   Click the "Fork" button at the top-right corner of this page.

2. **Clone Your Fork**:
   ```sh
   git clone https://github.com/<your-username>/ascendpath.git
   cd ascendpath
   ```

3. **Create a New Branch**:
   ```sh
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**:
   Add your feature or fix bugs.

5. **Commit Your Changes**:
   ```sh
   git commit -m "Add your message"
   ```

6. **Push Your Branch**:
   ```sh
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**:
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

## 🎉 Final Thoughts

AscendPath is more than just a tool—it's a step toward accessible and personalized education for everyone. Whether you're exploring innovative solutions or collaborating on impactful ideas, AscendPath is designed to adapt and grow with your vision.

Feel free to explore, contribute, and make this project even better. Together, we can create something truly transformative.

✨ **Let’s ascend together!** 🚀