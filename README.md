# OpportunityOS

OpportunityOS is a comprehensive, gamified career development platform designed to bridge the gap between learning and professional readiness. It helps students, career changers, and tech professionals understand their current skills, explore suitable career paths, build professional resumes, and take practical steps towards their goals in a highly engaging environment.

---

## What OpportunityOS Solves
Many early-career professionals struggle to translate their academic or self-taught skills into a coherent professional narrative. OpportunityOS solves this by:
1. **Unifying the Career Journey**: Combining skill tracking, resume building, and career exploration into a single cohesive platform.
2. **Actionable AI Feedback**: Instead of generic advice, AI analyzes the user's specific resume and GitHub profile to provide targeted, ATS-friendly recommendations.
3. **Engaging Skill Assessment**: Replacing boring assessments with a gamified "Skill Arcade" to test coding speed, technology categorization, and career knowledge.

---

## 🚀 Recommended Demo Journey
To experience the true value of OpportunityOS, follow this major user journey:

1. **Authentication & Onboarding**: Sign up to see the secure Firebase-backed authentication flow.
2. **Dashboard Overview**: Review the overarching UI, telemetry summary, and dynamic Recent Activity timeline.
3. **Profile & GitHub**: Navigate to the Profile page, enter professional details, and use the **GitHub Analyzer** to pull repository statistics and language charts.
4. **Resume Builder & AI Analysis**: Navigate to the Resume dashboard. Generate a professional PDF resume based on your profile data. Run the **AI Resume Analysis** to see detailed ATS scoring and actionable feedback.
5. **Career Match Engine**: Use the Career insights module to generate an AI-driven career roadmap based on your current tech stack and missing skills.
6. **Skill Arcade**: Play a round of **Code Rush** (typing speed) or **Tech Match** (drag-and-drop/matching) to demonstrate the gamified learning loop. View the Results screen to see your score, accuracy, and XP gain applied to your global profile.

---

## 🛠️ Main Features

*   **Resume Builder & AI Analyzer**: Generate minimalist, professional PDF resumes. Includes a dedicated AI analysis engine that grades resumes against ATS standards and suggests specific improvements.
*   **Career Match Engine & Roadmaps**: Get AI-driven recommendations for project ideas, missing skills, and step-by-step career roadmaps based on your current profile.
*   **Skill Arcade**: A suite of gamified minigames designed to test and improve technical knowledge:
    *   *Code Rush*: A high-speed coding typing test.
    *   *Skill Sprint*: Rapid-fire technical trivia.
    *   *Tech Match*: Pair technologies with their correct categories.
    *   *Career Quiz*: Deep-dive questions on tech roles and practices.
*   **GitHub Analyzer**: Ingests public GitHub repository data to analyze coding patterns, top languages, and activity frequency to align with career goals.
*   **Career Coach**: An interactive AI chat interface to provide personalized career advice based on your platform context.
*   **Admin Dashboard**: A centralized view for platform administrators to track telemetry events (resumes generated, games played, matches made) and review community-submitted opportunities.

---

## 💻 Technology Stack

*   **Frontend**: React 19, Vite, React Router v7
*   **Styling**: Tailwind CSS v4, Framer Motion, Lucide React
*   **Backend / Persistence**: Firebase (Firestore, Auth, Storage)
*   **Data Visualization**: Recharts (for GitHub language distribution)
*   **PDF Generation**: `jspdf`, `html2canvas`

---

## 🧠 AI Integration Architecture

OpportunityOS features a highly modular AI integration layer (`createApiProvider`).
*   **Multi-Model Support**: Capable of switching between Gemini, Groq, OpenRouter, or running on local/mock data templates.
*   **Context-Aware Prompts**: The AI engines (Resume, Match, Coach) dynamically inject user profile data, GitHub stats, and Skill Arcade scores into their system prompts to provide highly personalized, non-generic feedback.

---

## 🔥 Firebase Architecture

OpportunityOS heavily relies on Firebase for robust, real-time data management:
*   **Firestore**: Uses distinct collections (`users`, `resumes`, `telemetry_events`, `opportunities`, `connections`).
*   **Real-time Sync**: Utilizes Firestore's `onSnapshot` listeners to provide instant updates to the UI when a user earns XP, finishes a game, or updates their profile.
*   **Security & Permissions**: Client-side routing protects administrative routes. (Note: True security requires implementing Firestore Security Rules).
*   **Storage**: Used for securely managing user avatars and generated artifacts.

---

## ⚠️ Known MVP Limitations
To ensure transparency during evaluation, the following are known limitations in the current MVP build:
1. **Analytics Scope**: The Admin Dashboard relies on aggregate document counts (e.g., total resumes generated) rather than unique-user sessions. There is no complex real-time presence system implemented.
2. **PDF Generation Method**: The Resume Builder relies on `html2canvas` to take a snapshot of the DOM for PDF generation. While visually accurate, the resulting PDF text is not natively selectable.
3. **Static GitHub Fetching**: The GitHub Analyzer pulls public data via unauthenticated REST API calls. Private repositories are not analyzed, and rate limits may apply.
4. **Mocked Presentation Exports**: Some placeholder "Export" buttons in the Presentation module currently trigger browser alerts rather than initiating file downloads.

---

## ⚙️ Installation & Setup

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
    Create a `.env` file in the root directory:
    ```env
    VITE_FIREBASE_API_KEY="your-firebase-api-key"
    VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
    VITE_FIREBASE_APP_ID="your-app-id"
    VITE_AI_PROVIDER="gemini" # or groq, mock
    VITE_GEMINI_API_KEY="your-gemini-key"
    ```

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
