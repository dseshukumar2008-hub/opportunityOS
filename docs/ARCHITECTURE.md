# OpportunityOS Architecture

This document explains the overarching architectural decisions in OpportunityOS, helping new developers understand the data flow, state management, and service abstractions.

## State Management (Context Providers)
OpportunityOS relies heavily on React Context for global state rather than Redux or Zustand. This decision was made to keep dependencies light and colocate domain-specific logic.

*   **`AuthContext`**: Manages the Firebase authentication listener. Exposes `user`, `login`, and `logout`. It gates access to the `/dashboard` routes using the `<ProtectedRoute>` wrapper.
*   **`ResumeContext`**: Manages the user's active resume and autosaves changes to Firebase Firestore via a debounced queue. Validation and scoring logic are decoupled into `src/utils/resumeValidationUtils.js`.
*   **`ActivityContext`**: A global event bus that records user actions (e.g., finishing a game, generating a roadmap) and writes them to the `recent_activity` Firestore collection for display on the Dashboard.
*   **`SkillArcadeContext`**: Manages user streaks, daily rewards, and XP for the gamified minigames.

## AI Provider Architecture (`src/services/ai`)
OpportunityOS supports multiple AI providers (Gemini, Groq, OpenRouter) and offline fallback templates to ensure high availability.

### `createApiProvider.js`
This file acts as a factory abstraction. Instead of hardcoding `fetch` requests to specific LLM endpoints across the app, we instantiate providers with `createApiProvider({ name, model, endpoint })`. 
*   **Why**: It allows the system to seamlessly switch AI backends (e.g., if Gemini rate-limits, it falls back to Groq) without the UI components knowing which LLM actually served the request.
*   **Fallback Logic**: The `aiProvider.js` orchestration layer implements a 3-retry backoff mechanism. If all network providers fail, it falls back to `templateProvider.js`, which returns pre-generated, static JSON responses to ensure the user is never stuck on an infinite loading screen.

## Feature Flows

### Resume Analysis Flow
1. User uploads a PDF in `ResumeReviewPage`.
2. `useResumeAnalysis` custom hook processes the file using `pdfjs-dist` to extract raw text entirely client-side.
3. The raw text is passed to the AI Provider, requesting a JSON extraction of skills and experience.
4. The response is piped through `matchScoringEngine.js` to calculate ATS compatibility and missing keywords.

### Skill Arcade Architecture
The games (Code Rush, Tech Match, etc.) are purely functional React components. 
*   **State Separation**: To avoid massive duplicate code, all endgame lifecycle events (saving scores, checking streaks, computing daily rewards) are handled by the custom `useGameCompletion` hook.
*   **Randomization**: Questions are selected via a Fisher-Yates shuffle at the start of the game to ensure non-deterministic gameplay.

### Firebase Integration
Firebase is initialized in `src/config/firebase.js`.
*   **Firestore Cache**: Persistent local caching is explicitly enabled (`persistentLocalCache`) so the application can still render the user's previous resume and dashboard layout even on unstable internet connections.
