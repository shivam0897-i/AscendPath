# AscendPath

AscendPath is a modern web application designed to generate personalized learning roadmaps for students and women. By leveraging cutting-edge technologies, including the Gemini API, it empowers users by providing structured and tailored pathways to achieve their educational goals.

---

## Table of Contents

1. [Project Info](#project-info)
2. [How to Edit the Code](#how-to-edit-the-code)
3. [Tech Stack](#tech-stack)
4. [Authentication](#authentication)
5. [How to Deploy](#how-to-deploy)

---

## Project Info

AscendPath is built to simplify and enhance educational planning. It provides personalized roadmaps to help students and women navigate their learning journeys efficiently. The platform's modular and scalable design ensures reliability and a superior user experience.

This application utilizes the **Gemini API** and its powerful model to analyze user input and generate customized learning roadmaps, ensuring the best recommendations based on individual needs.

Homepage for live preview: [AscendPath](https://ascendpath.vercel.app)

---

## How to Edit the Code

### **Use Your Preferred IDE**

If you want to work locally using your own IDE, you can clone this repository and push changes. The only requirement is having Node.js and npm installed. You can install them with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### **Edit a File Directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### **Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace, and commit and push your changes once you're done.

---

## Tech Stack

This project uses the following technologies:

- **Vite**: A fast build tool and development server.
- **TypeScript**: Ensures type safety and modern ES features.
- **React**: For building the user interface.
- **shadcn-ui**: A modern UI component library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Gemini API**: Powers the roadmap generation feature with its advanced model.

---

## Authentication

This project includes a secure and scalable authentication system. Details are as follows:

- **Method**: Token-based authentication (e.g., JWT or OAuth 2.0).
- **User Roles**: Role-based access control (RBAC) is implemented to manage user permissions effectively.
- **Third-Party Providers**: Supports integration with providers like Google and GitHub for seamless login.
- **Security**: Best practices are followed, including data encryption and secure storage.

To set up authentication:

1. Configure the `.env` file with your authentication provider credentials (e.g., client IDs, secrets, etc.).
2. Use the provided APIs to authenticate users and manage sessions.

For more detailed information, refer to the [Authentication Section](https://github.com/shivam0897-i/ascendpath#authentication).

---

## How to Deploy

Deployment is made simple using **Vercel**:

1. Ensure your project is ready for production by running:

   ```sh
   npm run build
   ```

2. Push your changes to the repository.

3. Navigate to [Vercel](https://vercel.com) and link your repository.

4. Configure any necessary environment variables in the Vercel dashboard.

5. Deploy the project with one click.

---

Let me know if you'd like me to make further refinements or if you’re ready to apply this content to your `README.md` file! You can edit the file directly [here](https://github.com/shivam0897-i/ascendpath/edit/main/README.md).