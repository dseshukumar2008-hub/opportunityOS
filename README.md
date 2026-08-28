# OpportunityOS

OpportunityOS is a comprehensive career development platform designed to help students and learners understand their current skills, explore suitable career paths, build professional resumes, and take practical steps towards their professional goals.

## Core Features
*   **Resume Builder & AI Analyzer**: Create minimalist, professional resumes and analyze them against ATS standards.
*   **Career Match Engine**: Get AI-driven recommendations for project ideas and missing skills.
*   **Skill Arcade**: Gamified minigames (Code Rush, Skill Sprint, Tech Match, Career Quiz) to learn and test technical knowledge.
*   **GitHub Analyzer**: Analyze coding patterns, top languages, and activity to align with career goals.
*   **Career Coach**: An interactive AI chat interface to provide personalized career roadmap advice.

---

## Tech Stack
*   **Frontend**: React 19, Vite, React Router v7
*   **Styling**: Tailwind CSS v4, Framer Motion, Lucide React
*   **Backend / Persistence**: Firebase (Firestore, Auth, Storage)
*   **AI Integration**: `createApiProvider` abstraction supporting Gemini, Groq, OpenRouter, and offline templates.
*   **PDF Generation**: `jspdf`, `pdfjs-dist`, `html2canvas`

---

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dseshukumar2008/opportunity-os.git
    cd opportunity-os
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory (or use `.env.development`) based on `.env.example`:
    ```env
    VITE_FIREBASE_API_KEY="your-firebase-api-key"
    VITE_API_BASE_URL="http://localhost:8080"
    ```
    *Note: The app relies on Firebase for authentication and database services. Ensure you have configured Firebase correctly if you are hosting your own instance.*

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Available Scripts

*   `npm run dev` - Starts the Vite development server.
*   `npm run build` - Creates a production-ready optimized build in the `/dist` directory.
*   `npm run lint` - Runs ESLint to check for code quality and style errors.
*   `npm run preview` - Previews the production build locally.

---

## Architecture Overview

For a detailed look at how OpportunityOS handles state, context providers, the AI pipeline, and modular component architecture, please refer to the [Architecture Documentation](docs/ARCHITECTURE.md).
